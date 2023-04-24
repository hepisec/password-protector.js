# password-protector.js

Protect client passwords by hashing them before submission

## What it does

If you authenticate on a website using a form, you typically enter a user identifier (e.g. username or email address) and a password. Then the password is sent to the remote site and there it will be compared with a stored password.

It is currently best practice to use a password hashing algorithm on the submitted password on the remote site to store and verify the password. But with this practice, the remote site can still access your original password, thus it could get leaked.

To prevent the remote site from accessing the original passwords, they must get hashed on the client side before submission.

**password-protector.js** does exactly this.

## How it works

You simply include password-protector.min.js at the end of your login form and add `data-salt-field` attribute to your `<form>` element. The value of the `data-salt-field` attribute is the name of your user identifier field (see example below).

```html
<form method="POST" data-salt-field="email">
  <label for="email">E-Mail</label>
  <input type="email" name="email" id="email" /><br />
  <label for="password">Password</label>
  <input type="password" name="password" id="password"><br />
  <label for="password2">Verify Password</label>
  <input type="password" name="password2" id="password2"><br />
  <button type="submit">Submit</button>
</form>
<script src="password-protector.min.js"></script>
```

## Important notes

1. You must use **password-protector.js** in your **registration form** and **change password form**, too.
2. **Keep your existing password hashing algorithm** on the server side to prevent extraction of authentication keys (= protected passwords) from your database. If an attacker can get access to the password-protector-hashes, he can authenticate to your application.
3. If you have **existing users**, **don't use password-protector.js**. The protected passwords could not get compared against the stored hashes of original passwords. You have to modify **password-protector.js** to create a proper migration.

## Technical notes

- **password-protector.js** uses `PBKDF2` to create the client side hash of the original password.
- The field given in the `data-salt-field` attribute is used as salt. Using the user identifier as salt has the advantage that the salt does not need to be stored on the client side and is unique per user.
  - If the user can **change his identifier** (e.g. email address), you must **update the password hash**!
  - The login form must always take the same user identifier (e.g. email address only, not email or username)
