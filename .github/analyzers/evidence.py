"""Bind reports to source and reject missing, incomplete or finding-bearing reports."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys


def source_files():
    return sorted(p for p in subprocess.check_output(
        ['git', 'ls-files', 'src', 'test', 'scripts'], text=True
    ).splitlines() if Path(p).suffix in ('.js', '.mjs'))


def capture(directory):
    destination = Path(directory)
    destination.mkdir(parents=True, exist_ok=True)
    files = source_files()
    if not files:
        raise ValueError('No JavaScript source files found')
    tracked = subprocess.check_output(['git', 'ls-files', '.github', '.semgrepignore', '.gitignore', 'package.json'], text=True).splitlines()
    manifest = {
        'commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(),
        'event': os.getenv('GITHUB_EVENT_NAME'),
        'run_id': os.getenv('GITHUB_RUN_ID'),
        'run_attempt': os.getenv('GITHUB_RUN_ATTEMPT'),
        'scope': {p: hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in files},
        'configuration': {p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
                          for p in tracked if Path(p).is_file()},
        'limitations': 'Source scope is intended coverage; inspect analyzer coverage and diagnostics too.',
    }
    (destination / 'source.json').write_text(json.dumps(manifest, indent=2) + '\n')


def verify(kind, path):
    report = json.loads(Path(path).read_text())
    if kind == 'eslint':
        expected = {str(Path(p).resolve()) for p in source_files()}
        actual = {r['filePath'] for r in report}
        if actual != expected:
            raise ValueError('ESLint coverage differs from tracked JavaScript scope')
        if any(r['messages'] or r.get('errorCount') or r.get('warningCount') for r in report):
            raise ValueError('ESLint findings or warnings require disposition')
    elif kind == 'semgrep':
        if report.get('errors') or report.get('results'):
            raise ValueError('Semgrep errors or findings require disposition')
        if not report.get('version') or not source_files():
            raise ValueError('Missing Semgrep version or source scope')
        actual = {str(Path(p).resolve()) for p in report['paths']['scanned']}
        if actual != {str(Path(p).resolve()) for p in source_files()}:
            raise ValueError('Semgrep coverage differs from tracked JavaScript scope')
    elif kind == 'codeql':
        runs = report.get('runs', [])
        if not runs:
            raise ValueError('Missing CodeQL SARIF runs')
        for run in runs:
            if not run.get('tool', {}).get('driver', {}).get('rules'):
                raise ValueError('Missing CodeQL rule inventory')
            if run.get('results'):
                raise ValueError('CodeQL findings require disposition')
            invocations = run.get('invocations', [])
            if not invocations or any(i.get('executionSuccessful') is not True for i in invocations):
                raise ValueError('CodeQL execution incomplete')
            for invocation in invocations:
                if any(n.get('level') == 'error'
                       for n in invocation.get('toolExecutionNotifications', [])):
                    raise ValueError('CodeQL execution diagnostics contain errors')
    else:
        raise ValueError('Unknown analyzer')
    print(f'PASS: {kind} report is complete and contains no findings')


if __name__ == '__main__':
    if sys.argv[1] == 'capture':
        capture(sys.argv[2])
    else:
        verify(sys.argv[1], sys.argv[2])
