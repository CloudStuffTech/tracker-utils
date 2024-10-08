const Mailgun = require('mailgun.js');
const formData = require('form-data');

const mailgun = new Mailgun(formData);
const ejs = require("ejs");

/**
 * This class is used to send email to the users.
 * @author Hemant Mann <hemant.mann@trackier.com>
 * @author Arpit Jain <arpit@trackier.com>
 */
class Mailer {

	/**
	 * @constructor
	 * @param {object} config - mailgun config
	 * @param {Function} [logger] - callback function to log messages
	 */
	constructor(config, logger = null) {
		this.config = config;
		this.logger = logger;
		if (!this.config) {
			throw new Error("Mailgun config not found.");
		}
		const mg = mailgun.client({ username: 'api', key: this.config.apikey });
		this.mailgun = mg;
	}

	/**
	 * [PRIVATE] This method will log message using the logger function if provided
	 * @param {*} message - message to log
	 */
	_logMessage(message) {
		if (this.logger) {
			this.logger(message);
		}
	}

	/**
	 * [PRIVATE] This method will return the utf-8 content string of the email template with the 
	 * parsed template variables.
	 * 
	 * @param {string} templateStr - ejs template string to be parsed
	 * @param {object} templateOpts - template options to be substitutedin parsed string
	 * 
	 * @returns {string}
	 * @author Arpit Jain <arpit@trackier.com>
	 */
	_getTemplateContent(templateStr, templateOpts) {
		const template = ejs.compile(templateStr);
		return template(templateOpts);
	}

	/**
	 * [PUBLIC] This method should be called to send the email to the users.
	 * @param {string} templateStr - ejs template string
	 * @param {object} mailOpts - mail options { to: <String>, subject: <String> }
	 * @param {object} [templateOpts] - { [string]: any }
	 * 
	 * @returns {Promise<boolean>}
	 * @author Hemant Mann <hemant.mann@trackier.com>
	 */
	async send(templateStr, mailOpts, templateOpts = {}) {
		try {
			const emailHtmlContent = this._getTemplateContent(templateStr, templateOpts);
			const mailOptions = {
				from: `Trackier ${this.config.fromEmail}`,
				to: mailOpts.to,
				subject: mailOpts.subject,
				html: emailHtmlContent
			};

			this._logMessage(body);
			await this.mailgun.messages.create(this.config.domain, mailOptions);
			return true;
		} catch (error) {
			this._logMessage(`[ERROR][MAILER] ${error}`);
			return false;
		}
	}
}

module.exports = Mailer;
