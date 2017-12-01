'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js')
;

module.exports = {
	ServerModuleName: 'OAuthIntegratorWebclient',
	HashModuleName: 'oauth-integrator',
	
	AuthModuleName: 'StandardAuth',
	OnlyPasswordForAccountCreate: true,
	userAccountLogin: ko.observable(''),
	userAccountsCount: ko.observable(0),
	
	EOAuthIntegratorError: {},
	
	Services: [],
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['%ModuleName%'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.AuthModuleName = Types.pString(oAppDataSection.AuthModuleName, this.AuthModuleName);
			this.OnlyPasswordForAccountCreate = Types.pBool(oAppDataSection.OnlyPasswordForAccountCreate, this.OnlyPasswordForAccountCreate);
			this.Services = Types.pArray(oAppDataSection.Services, this.Services);
			this.EOAuthIntegratorError = Types.pObject(oAppDataSection.EOAuthIntegratorError);
		}
		
		App.registerUserAccountsCount(this.userAccountsCount);
	},
	
	/**
	 * Sets user auth account login.
	 * 
	 * @param {string} sUserAccountLogin
	 */
	setUserAccountLogin: function (sUserAccountLogin)
	{
		this.userAccountLogin(Types.pString(sUserAccountLogin));
	},
	
	/**
	 * Updates settings that is edited by administrator.
	 * 
	 * @param {object} oServices Object with services settings.
	 */
	updateAdmin: function (oServices)
	{
		_.each(this.Services, function (oService) {
			var oNewService = oServices[oService.Name];
			if (oNewService)
			{
				oService.EnableModule = oNewService.EnableModule;
				oService.Id = oNewService.Id;
				oService.Secret = oNewService.Secret;
			}
		});
	}
};
