'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	Types = require('modules/CoreClient/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: 'ExternalServices',
	HashModuleName: 'externalServices',
	
	AuthModuleName: 'StandardAuth',
	OnlyPasswordForAccountCreate: true,
	userAccountLogin: ko.observable(''),
	
	Services: [],
	
	/**
	 * Initializes settings from AppData object section of this module.
	 * 
	 * @param {Object} oAppDataSection Object contained module settings.
	 */
	init: function (oAppDataSection)
	{
		if (oAppDataSection)
		{
			this.AuthModuleName = Types.pString(oAppDataSection.AuthModuleName);
			this.OnlyPasswordForAccountCreate = !!oAppDataSection.OnlyPasswordForAccountCreate;
			this.Services = _.isArray(oAppDataSection.Services) ? oAppDataSection.Services : [];
		}
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
