"""Negative controls for reports that could otherwise look falsely clean."""
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from evidence import verify


class EvidenceChecks(unittest.TestCase):
    def check_report(self, kind, report, fails):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'report.json'
            path.write_text(json.dumps(report))
            with patch('evidence.source_files', return_value=['src/gate.js']):
                if fails:
                    with self.assertRaises((ValueError, KeyError)):
                        verify(kind, path)
                else:
                    verify(kind, path)

    def test_semgrep_clean_and_incomplete(self):
        clean = {'version': 'test', 'errors': [], 'results': [],
                 'paths': {'scanned': ['src/gate.js']}}
        self.check_report('semgrep', clean, False)
        for change in ({'errors': [{'message': 'parse failed'}]},
                       {'results': [{'check_id': 'unsafe'}]},
                       {'paths': {'scanned': []}}):
            self.check_report('semgrep', {**clean, **change}, True)

    def test_eslint_missing_file_or_finding(self):
        clean = [{'filePath': str(Path('src/gate.js').resolve()), 'messages': []}]
        self.check_report('eslint', clean, False)
        self.check_report('eslint', [], True)
        self.check_report('eslint', [{**clean[0], 'messages': [{'fatal': True}]}], True)

    def test_codeql_missing_failed_or_finding(self):
        run = {'tool': {'driver': {'rules': [{'id': 'test'}]}},
               'invocations': [{'executionSuccessful': True}], 'results': []}
        self.check_report('codeql', {'runs': [run]}, False)
        self.check_report('codeql', {'runs': []}, True)
        for change in ({'invocations': [{'executionSuccessful': False}]},
                       {'results': [{'ruleId': 'unsafe'}]}, {'tool': {}}):
            self.check_report('codeql', {'runs': [{**run, **change}]}, True)


if __name__ == '__main__':
    unittest.main()
