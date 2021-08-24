const Mailgun = require("mailgun-js");
const ejs = require("ejs");

/**
 * This class is used to send email to the users.
 * @author Arpit Jain <arpit@trackier.com>
 */
class Mailer {

	/**
	 * @constructor
	 * @param {object} config - mailgun config
	 * @param {string} templateStr - ejs template string
	 * @param {object} mailOpts - mail options { to: <String>, subject: <String> }
	 * @param {object} templateOpts - { [string]: any }
	 * @param {Function} [logger] - callback function to log messages
	 */
	constructor(config, templateStr, mailOpts, templateOpts = null, logger = null) {
		this.config = config;
		this.templateStr = templateStr;
		this.mailOpts = mailOpts;
		this.templateOpts = templateOpts || {};
		this.logger = logger;
	}

	/**
	 * [PRIVATE] This method will log message using the logger function if provided
	 * @param {*} message - message to log
	 */
	_logMessage(message){
		if (this.logger) {
			this.logger(message);
		}
	}

	/**
	 * [PRIVATE] This method will return the utf-8 content string of the email template with the 
	 * parsed template variables.
	 * @author Arpit Jain <arpit@trackier.com>
	 */
	_getTemplateContent() {
		const template = ejs.compile(this.templateStr);
		return template(this.templateOpts);
	}

	/**
	 * [PUBLIC] This method should be called to send the email to the users.
	 * @returns {Promise<boolean>}
	 * @author Arpit Jain <arpit@trackier.com>
	 */
	send() {
		return new Promise((resolve, reject) => {
			try {
				if (!this.config) {
					throw new Error("Mailgun config not found");
				}
				const mailgun = Mailgun({
					apiKey: this.config.apikey,
					domain: this.config.domain
				});

				const emailHtmlContent = this._getTemplateContent();
				const mailOpts = {
					from: `Trackier ${this.config.fromEmail}`,
					to: this.mailOpts.to,
					subject: this.mailOpts.subject,
					html: emailHtmlContent
				};

				mailgun.messages().send(mailOpts, (error, body) => {
					if (error) {
						this._logMessage(error);
						resolve(false);
					} else {
						this._logMessage(body);
						resolve(true);
					}
				});
			} catch (error) {
				this._logMessage(`[ERROR][MAILER] ${error}`);
				resolve(false);
			}
		});

	}
}

module.exports = Mailer;
