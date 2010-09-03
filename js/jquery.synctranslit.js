/**
 * jQuery syncTranslit plugin
 *
 * Copyright (c) 2009 Snitko Roman
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * @author 	Roman Snitko snowcore.net@gmail.com
 * @link http://snowcore.net/
 * @version 0.0.7
 */
;(function($){
    $.transliterateAll = function(str) {
	// TODO: make this configurable as the others are
	var o = $.transliterate.defaults;
	var result = '';
	for (var i = 0; i < str.length; i++) {
	    result += $.transliterate(str.charAt(i), o)
	}
	var regExp = new RegExp('[' + o.urlSeparator + ']{2,}', 'g');
	result = result.replace(regExp, o.urlSeparator);
	return result;
    };
    
    /**
     * Transliterate character
     * @param {String} character
     * @param {Object} opts
     */
    $.transliterate = function(char, opts) {
    	var charIsLowerCase = true, trChar;
    	if (char.toLowerCase() != char) {
    		charIsLowerCase = false;
    	}
    	
    	char = char.toLowerCase();
    	
    	var index = opts.dictOriginal.indexOf(char);
    	if (index == -1) {
    		trChar = char;
    	} else {
    		trChar = opts.dictTranslate[index];
    	}
    	
    	if (opts.type == 'url') {
	    	var code = trChar.charCodeAt(0);
	    	if (code >= 33  && code <= 47 && code != 45
	    		|| code >= 58  && code <= 64
	    		|| code >= 91  && code <= 96
	    		|| code >= 123 && code <= 126
	    		|| code >= 1072
	    	) {
	    		return '';
	    	}
	    	if (trChar == ' ' || trChar == '-') {
	    		return opts.urlSeparator;
	    	}
    	}
    	
    	if (opts.caseStyle == 'upper') {
    		return trChar.toUpperCase();
    	} else if (opts.caseStyle == 'normal') {
    		if (charIsLowerCase) {
    			return trChar.toLowerCase();
    		} else {
    			return trChar.toUpperCase();
    		}
    	}
	    return trChar;
    };
    
    /**
     * Default options
     */
    $.transliterate.defaults = {
        /**
         * Dictionaries
         */
        dictOriginal:  ['а', 'б', 'в', 'г', 'д', 'е',
                        'ё', 'ж', 'з', 'и', 'й', 'к',
                        'л', 'м', 'н', 'о', 'п', 'р',
                        'с', 'т', 'у', 'ф', 'х', 'ц',
                        'ч', 'ш', 'щ', 'ъ', 'ы', 'ь',
                        'э', 'ю', 'я',
                        'і', 'є', 'ї', 'ґ'
                        ],
        dictTranslate: ['a', 'b', 'v', 'g', 'd', 'e',
                        'e', 'zh','z', 'i', 'j', 'k',
                        'l', 'm', 'n', 'o', 'p', 'r',
                        's', 't', 'u', 'f', 'h', 'ts',
                        'ch','sh','sch', '', 'y', '',
                        'e', 'ju', 'ja',
                        'i', 'je', 'ji', 'g'
                        ],
        
        /*
         * Case transformation: normal, lower, upper
         */
        caseStyle: 'lower',
        
        /*
         * Words separator in url
         */
        urlSeparator: '_',
        
        /*
         * Transliteration type: raw or url
         *    url - used for transliterating text into url slug
         *    raw - raw transliteration (with special characters)
         */
        type: 'url'
    };
})(jQuery);