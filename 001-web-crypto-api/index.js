const getMessage = () => {
  let message = document.querySelector('#pbkdf2-message').value;
  let enc = new TextEncoder();
  return enc.encode(message);
};

const printCiphertext = (ciphertext) => {
  // ciphertextValue is an HTML element
  ciphertextValue.textContent = ciphertext;
};

const printPlaintext = (plaintext) => {
  // plaintextValue is an HTML element
  plaintextValue.textContent = plaintext;
};

const encrypt = async (iterations) => {
  let rounds = iterations || 500000;
  let msg = getMessage();

  let password = window.prompt('Enter your secret phrase');
  let passbits = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    {
      name: 'PBKDF2',
    },
    false,
    ['deriveBits']
  );

  let salt = crypto.getRandomValues(new Uint8Array(32));
  let iv = crypto.getRandomValues(new Uint8Array(12));

  let bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: rounds,
      hash: {
        name: 'SHA-256',
      },
    },
    passbits,
    256
  );

  let key = await crypto.subtle.importKey(
    'raw',
    bits,
    {
      name: 'AES-GCM',
    },
    false,
    ['encrypt']
  );

  let enc = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    msg
  );

  let iterationsHash = btoa(rounds.toString());

  let saltHash = btoa(
    Array.from(new Uint8Array(salt))
      .map((val) => {
        return String.fromCharCode(val);
      })
      .join('')
  );

  let ivHash = btoa(
    Array.from(new Uint8Array(iv))
      .map((val) => {
        return String.fromCharCode(val);
      })
      .join('')
  );

  let encHash = btoa(
    Array.from(new Uint8Array(enc))
      .map((val) => {
        return String.fromCharCode(val);
      })
      .join('')
  );

  // Print the result on screen
  let ciphertext =
    iterationsHash + '.' + saltHash + '.' + ivHash + '.' + encHash;
  printCiphertext(ciphertext);
  return ciphertext;
};

const decrypt = async (encrypted) => {
  let parts = encrypted.split('.');
  let rounds = parseInt(atob(parts[0]));

  let salt = new Uint8Array(
    atob(parts[1])
      .split('')
      .map((val) => {
        return val.charCodeAt(0);
      })
  );

  let iv = new Uint8Array(
    atob(parts[2])
      .split('')
      .map((val) => {
        return val.charCodeAt(0);
      })
  );

  let enc = new Uint8Array(
    atob(parts[3])
      .split('')
      .map((val) => {
        return val.charCodeAt(0);
      })
  );

  let password = window.prompt('Enter your secret phrase');
  let passbits = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    {
      name: 'PBKDF2',
    },
    false,
    ['deriveBits']
  );

  let bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: rounds,
      hash: {
        name: 'SHA-256',
      },
    },
    passbits,
    256
  );

  let key = await crypto.subtle.importKey(
    'raw',
    bits,
    {
      name: 'AES-GCM',
    },
    false,
    ['decrypt']
  );

  let plaintext = '';

  try {
    let dec = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      enc
    );

    plaintext = new TextDecoder().decode(dec);
  } catch (e) {
    plaintext = `Something wrong: ${e}`;
  }

  printPlaintext(plaintext);
  return plaintext;
};
