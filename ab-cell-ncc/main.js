/**
Провайдер AnyBalance (http://any-balance-providers.googlecode.com)

Провайдер NCC (Республика Татарстан, Нижегородский филиал)
Сайт оператора: http://ncc-volga.ru/
Личный кабинет: https://iserve.ncc-volga.ru/
**/

function main(){
	var prefs = AnyBalance.getPreferences();
	var baseurl = 'https://iserve.ncc-volga.ru/';

	AnyBalance.setDefaultCharset('koi8-r');
    
//	var info = AnyBalance.requestGet(baseurl + '?path=exit');

// Заходим на главную страницу
	AnyBalance.trace("Authorizing...");
	var info = AnyBalance.requestPost(baseurl ,{ path:'iserv',userv:prefs.userv,passv:prefs.passv});

	var error = $('#errHolder', info).text();
	if(error){
		throw new AnyBalance.Error(error);
	}

	if(matches = info.match(/<td align="center" valign="middle" class="red">(.*?)<\/td>/i)){
		throw new AnyBalance.Error(matches[1]);
	}

	var result = {success: true};

	AnyBalance.trace('Parsing...');
	if(prefs.region == "1"){	// Татарстан
		if(AnyBalance.isAvailable('balance')){
			if(matches = info.match(/<dd.*?>Баланс:<\/dd>\s*<dd.*?>(.*?) руб.<\/dd>/i)){
				result.balance = parseFloat(matches[1].replace(',','.'));
			}
			else{
				throw new AnyBalance.Error("Error");
			}
		}
		if(AnyBalance.isAvailable('bonus')){
			if(matches = info.match(/<dd.*?>Бонус:<\/dd>\s*<dd.*?>(.*?) руб.<\/dd>/i)){
				result.bonus = parseFloat(matches[1].replace(',','.'));
			}
		}
	}
	else if(prefs.region == "2"){	// Нижегородский
		if(AnyBalance.isAvailable('balance')){
			if(matches = info.match(/<dd.*?>Баланс:<\/dd>\s*<dd.*?>(.*?) руб.<\/dd>/i)){
				result.balance = parseFloat(matches[1].replace(',','.'));
			}
			else{
				throw new AnyBalance.Error("Error");
			}
		}
		if(AnyBalance.isAvailable('bonus')){
			if(matches = info.match(/<dd.*?>Бонус:<\/dd>\s*<dd.*?>(.*?) руб.<\/dd>/i)){
				result.bonus = parseFloat(matches[1].replace(',','.'));
			}
		}
	}

	AnyBalance.trace("Fetching tariff...");
	info = AnyBalance.requestGet(baseurl + "?path=tarif");

	if(prefs.region == "1"){	// Татарстан
		if(matches = info.match(/Тариф: (.*?)</)){
			result.__tariff = matches[1];
		}
	}
	else if(prefs.region == "2"){	// Нижегородский
		if(matches = info.match(/Тариф: (.*?)</)){
			result.__tariff = matches[1];
		}
	}

	AnyBalance.setResult(result);


//	if(!AnyBalance.isSetResultCalled()){
//		throw new AnyBalance.Error("error")
//	}
};