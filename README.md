# tracker-utils
## Logger Masking Toggle

Masking is enabled by default.

To disable masking (Debug Mode):

```bash
MASK_LOGS=false node examples/loggerTest.js
```
To enable masking:

```bash
MASK_LOGS=true node examples/loggerTest.js
```
If MASK_LOGS is not set, masking remains enabled by default.
