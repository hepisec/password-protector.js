var PasswordProtector = {
    init: function () {
        let $this = this;
        let forms = document.querySelectorAll('form[data-salt-field]');

        forms.forEach(function (form) {
            let passwordFields = form.querySelectorAll('input[type="password"]');

            if (passwordFields.length < 1) {
                return;
            }

            let saltField = form.dataset.saltField;

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                $this.hashPasswordsAndSubmit(form, saltField, passwordFields);
            });
        });
    },

    getPasswordKey: function (password) {
        let enc = new TextEncoder();
        return window.crypto.subtle.importKey(
                'raw',
                enc.encode(password),
                'PBKDF2',
                false,
                ['deriveBits', 'deriveKey']
                );
    },

    getPasswordDigest: async function (salt, passwordKey) {
        let enc = new TextEncoder();
        let derivedPasswordBits = await window.crypto.subtle.deriveBits(
                {
                    'name': 'PBKDF2',
                    'salt': enc.encode(salt),
                    'iterations': 300000,
                    'hash': 'SHA-256'
                },
                passwordKey,
                256
                );
        let hashArray = Array.from(new Uint8Array(derivedPasswordBits));            // convert buffer to byte array
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    },

    hashPasswordsAndSubmit: async function (form, saltField, passwordFields) {
        for (let i = 0; i < passwordFields.length; i++) {
            let passwordField = passwordFields[i];
            let salt = form.elements[saltField].value.trim().toLowerCase();
            let plainTextPassword = form.elements[passwordField.name].value;
            let passwordKey = await this.getPasswordKey(plainTextPassword);
            let passwordDigest = await this.getPasswordDigest(salt, passwordKey);
            form.elements[passwordField.name].value = passwordDigest;
        }

        form.submit();
    }
}

PasswordProtector.init();