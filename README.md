# tracker-utils

A Node.js utility library for backend services, providing database, caching, messaging, security, logging, and other common infrastructure helpers.

**Requires Node.js >= 18.0.0**

## Installation

```bash
npm install tracker-utils
```

## Modules

| Module | Description |
|--------|-------------|
| **BufferWriter** | Buffer writing utilities |
| **Cache** | Caching layer (Memcached) |
| **Db** | MongoDB database connection (Mongoose) |
| **DbUtil** | Database helper utilities |
| **Messaging** | Message queue abstraction (Google Cloud Pub/Sub) |
| **Redis** | Redis client |
| **Registry** | Registry / service registration utilities |
| **Security** | ID generation, hashing (MD5), IP masking, AES encryption/decryption, base64 |
| **TrafficDistribution** | Traffic distribution utilities |
| **ArrayMethods** | Array helper methods |
| **StringMethods** | String helper methods |
| **Mailer** | Email sending (Mailgun) |
| **Request** | HTTP request utilities |
| **RequestV2** | HTTP client (Got-based) |
| **CloudStorage** | Google Cloud Storage client |
| **Logger** | Winston-based logging |
| **DevTool** | Development utilities |
| **UrlUtil** | URL parsing and manipulation |
| **Tools** | General helpers (`handleShutdown`, `sleep`) |

## Usage

### Messaging (Pub/Sub)

```javascript
const { Messaging } = require('tracker-utils');

const pubsub = Messaging.Factory.make('pubsub', {
  project: 'your-gcp-project',
  topic: 'your-topic',
  subscription: 'your-subscription',
  handler(message) {
    console.log(String(message.data));
    message.ack();
  },
});

await pubsub.send('Hello, world!');
await pubsub.receive();
```

### Security

```javascript
const { Security } = require('tracker-utils');
const security = new Security();

security.id();           // ULID-style unique ID
security.md5('string');  // MD5 hash
security.maskIp(ip);     // Mask last octet for privacy
security.encrypt(text, key);
security.decrypt(cipherText, key);
```

### Logger

```javascript
const { Logger } = require('tracker-utils');

Logger.info('message');
Logger.error('error', { err });
```

### Database (MongoDB)

```javascript
const { Db } = require('tracker-utils');

// Use Db for Mongoose connection and models
```

### Redis & Cache

```javascript
const { Redis, Cache } = require('tracker-utils');

// Redis client and Memcached-based cache
```

### Tools

```javascript
const { Tools } = require('tracker-utils');

Tools.sleep(1000);           // Promise-based delay (ms)
Tools.handleShutdown(cb);    // Graceful shutdown handler
```

## Development

- **Linting / format:** Prettier (see `prettier.config.js`)
- **Editor:** `.editorconfig` is included
- **CI:** Security scan (CodeQL) runs on pull requests to `master`

Pull requests are welcome. Please use the [pull request template](.github/PULL_REQUEST_TEMPLATE.md) when submitting changes.

## License

See [LICENSE](LICENSE)

