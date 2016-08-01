<?php

/* -AFTERLOGIC LICENSE HEADER- */

/**
 * CApiExternalServicesSocialManager class summary
 * 
 * @api
 * @package Account
 */
class CApiExternalServicesAccountManager extends AApiManager
{
	/**
	 * @var CApiEavManager
	 */
	public $oEavManager = null;
	
	/**
	 * @param CApiGlobalManager &$oManager
	 */
	public function __construct(CApiGlobalManager &$oManager, $sForcedStorage = '', AApiModule $oModule = null)
	{
		parent::__construct('account', $oManager, $oModule);
		
		$this->oEavManager = \CApi::GetSystemManager('eav', 'db');
	}
	
	/**
	 * @param int $iUserId
	 * @param string $sType
	 *
	 * @return \COAuthAccount
	 */
	public function getAccount($iUserId, $sType)
	{
		$mResult = false;
		try
		{
			$aEntities = $this->oEavManager->getEntities(
				'COAuthAccount', 
				array(),
				0,
				0,
				array(
					'IdUser' => $iUserId,
					'Type' => $sType
				));
			if (is_array($aEntities) && count($aEntities) > 0)
			{
				$mResult = $aEntities[0];
			}
		}
		catch (CApiBaseException $oException)
		{
			$mResult = false;
			$this->setLastException($oException);
		}
		return $mResult;
	}	
	
	/**
	 * @param string $sIdSocial
	 * @param string $sType
	 *
	 * @return \CSocial
	 */
	public function getAccountById($sIdSocial, $sType)
	{
		$mResult = false;
		try
		{
			$aEntities = $this->oEavManager->getEntities(
				'COAuthAccount', 
				array(),
				0,
				0,
				array(
					'IdSocial' => $sIdSocial,
					'Type' => $sType
				)
			);
			if (is_array($aEntities) && count($aEntities) > 0)
			{
				$mResult = $aEntities[0];
			}
			
		}
		catch (CApiBaseException $oException)
		{
			$mResult = false;
			$this->setLastException($oException);
		}
		return $mResult;
	}		
	
	/**
	 * @param int $iIdUser
	 *
	 * @return array
	 */
	public function getAccounts($iIdUser)
	{
		$aResult = false;
		try
		{
			$aResult = $this->oEavManager->getEntities(
				'COAuthAccount', 
				array(),
				0,
				0,
				array(
					'IdUser' => $iIdUser
				));
		}
		catch (CApiBaseException $oException)
		{
			$aResult = false;
			$this->setLastException($oException);
		}
		return $aResult;
	}	
	
	/**
	 * @param COAuthAccount &$oAccount
	 *
	 * @return bool
	 */
	public function createAccount(COAuthAccount &$oAccount)
	{
		$bResult = false;
		try
		{
			if ($oAccount->validate())
			{
				if (!$this->isExists($oAccount))
				{
					if (!$this->oEavManager->saveEntity($oAccount))
					{
						throw new \CApiManagerException(Errs::UsersManager_UserCreateFailed);
					}
				}
				else
				{
					throw new \CApiManagerException(Errs::UsersManager_UserAlreadyExists);
				}
			}

			$bResult = true;
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}

	/**
	 * @param COAuthAccount &$oAccount
	 *
	 * @return bool
	 */
	public function updateAccount(COAuthAccount &$oAccount)
	{
		$bResult = false;
		try
		{
			if ($oAccount->validate())
			{
				if (!$this->oEavManager->saveEntity($oAccount))
				{
					throw new CApiManagerException(Errs::UsersManager_UserCreateFailed);
				}
			}

			$bResult = true;
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}
	
	/**
	 * @param int $iIdUser
	 * @param string $sType
	 *
	 * @return bool
	 */
	public function deleteAccount($iIdUser, $sType)
	{
		$bResult = false;
		try
		{
			$oSocial = $this->getAccount($iIdUser, $sType);
			if ($oSocial)
			{
				if (!$this->oEavManager->deleteEntity($oSocial->iId))
				{
					throw new CApiManagerException(Errs::UsersManager_UserDeleteFailed);
				}
				$bResult = true;
			}
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}
	
	/**
	 * @param int $iIdUser
	 *
	 * @return bool
	 */
	public function deleteAccountByUserId($iIdUser)
	{
		$bResult = false;
		try
		{
			$bResult = $this->oStorage->deleteAccountByUserId($iIdUser);
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}	
	
	/**
	 * @param string $sEmail
	 *
	 * @return bool
	 */
	public function deleteAccountsByEmail($sEmail)
	{
		$bResult = false;
		try
		{
			$bResult = $this->oStorage->deleteAccountsByEmail($sEmail);
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}	
	
	/**
	 * @param COAuthAccount &$oAccount
	 *
	 * @return bool
	 */
	public function isExists(COAuthAccount $oAccount)
	{
		$bResult = false;
		
		$oResult = $this->oEavManager->getEntityById($oAccount->iId);
				
		if ($oResult instanceof \COAuthAccount)
		{
			$bResult = true;
		}
		
		return $bResult;
	}	
}