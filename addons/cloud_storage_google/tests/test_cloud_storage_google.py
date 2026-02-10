# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

import json
from urllib.parse import quote

from betopiaerp.tests.common import TransactionCase
from betopiaerp.exceptions import UserError

from .. import uninstall_hook


class TestCloudStorageGoogleCommon(TransactionCase):
    def setUp(self):
        super().setUp()
        # Don't ship a static private key in the repository; generate one at runtime.
        from cryptography.hazmat.primitives import serialization
        from cryptography.hazmat.primitives.asymmetric import rsa

        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        private_key_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        ).decode()

        self.DUMMY_GOOGLE_ACCOUNT_INFO = json.dumps({
            "type": "service_account",
            "project_id": "project_id",
            "private_key_id": "1234",
            "private_key": private_key_pem,
            "client_email": "account@project_id.iam.gserviceaccount.com",
            "client_id": "1234",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/account%40project_id.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com",
        }, indent=4)
        self.bucket_name = 'bucket_name'
        ICP = self.env['ir.config_parameter']
        ICP.set_param('cloud_storage_provider', 'google')
        ICP.set_param('cloud_storage_google_bucket_name', self.bucket_name)
        ICP.set_param('cloud_storage_google_account_info', self.DUMMY_GOOGLE_ACCOUNT_INFO)


class TestCloudStorageGoogle(TestCloudStorageGoogleCommon):
    def test_generate_signed_url(self):
        file_name = ' ¥®°²Æçéðπ⁉€∇⓵▲☑♂♥✓➔『にㄅ㊀中한︸🌈🌍👌😀.txt'
        attachment = self.env['ir.attachment'].create([{
            'name': file_name,
            'mimetype': 'text/plain',
            'datas': b'',
        }])
        attachment._post_add_create(cloud_storage=True)
        attachment._generate_cloud_storage_upload_info()
        attachment._generate_cloud_storage_download_info()
        self.assertTrue(attachment.url.startswith(f'https://storage.googleapis.com/{self.bucket_name}/'))
        self.assertTrue(attachment.url.endswith(quote(file_name)))

    def test_uninstall_fail(self):
        with self.assertRaises(UserError, msg="Don't uninstall the module if there are Google attachments in use"):
            attachment = self.env['ir.attachment'].create([{
                'name': 'test.txt',
                'mimetype': 'text/plain',
                'datas': b'',
            }])
            attachment._post_add_create(cloud_storage=True)
            attachment.flush_recordset()
            uninstall_hook(self.env)

    def test_uninstall_success(self):
        uninstall_hook(self.env)
        # make sure all sensitive data are removed
        ICP = self.env['ir.config_parameter']
        self.assertFalse(ICP.get_param('cloud_storage_provider'))
        self.assertFalse(ICP.get_param('cloud_storage_google_bucket_name'))
        self.assertFalse(ICP.get_param('cloud_storage_google_account_info'))
