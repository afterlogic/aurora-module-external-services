'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CCreateLoginPasswordView()
{
	this.visible = ko.computed(function () {
		return Settings.userAccountLogin() === '';
	});
	this.visibleSetPasswordForm = ko.observable(Settings.OnlyPasswordForAccountCreate);
	this.password = ko.observable('');
	this.login = ko.observable('');
	this.loginRequested = ko.observable(false);
	
	ko.computed(function () {
		if (!this.loginRequested() && this.visible() && this.visibleSetPasswordForm())
		{
			Ajax.send('%ModuleName%', 'GetAccounts', null, _.bind(function (oResponse) {
				if (_.isArray(oResponse.Result) && oResponse.Result.length > 0)
				{
					this.login(Types.pString(oResponse.Result[0].Email));
				}
				this.loginRequested(true);
				if (this.login() === '')
				{
					this.visibleSetPasswordForm(false);
				}
			}, this));
		}
	}, this).extend({ throttle: 200 });
}

CCreateLoginPasswordView.prototype.ViewTemplate = '%ModuleName%_CreateLoginPasswordView';

/**
 * Broadcasts event to auth module to create auth account.
 */
CCreateLoginPasswordView.prototype.setPassword = function ()
{
	App.broadcastEvent(Settings.AuthModuleName + '::CreateUserAuthAccount', {
		'Login': this.login(),
		'Password': this.password(),
		'SuccessCallback': _.bind(function () { this.visibleSetPasswordForm(false); }, this)
	});
};

module.exports = new CCreateLoginPasswordView();