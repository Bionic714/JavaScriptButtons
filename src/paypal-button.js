if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};

(function (document) {

	'use strict';

	var app = {},
		paypalURL = 'https://{env}.paypal.com/cgi-bin/webscr',
		qrCodeURL = 'https://{env}.paypal.com/webapps/ppint/qrcode?data={url}&pattern={pattern}&height={size}',
		bnCode = 'JavaScriptButton_{type}',
		prettyParams = {
			name: 'item_name',
			number: 'item_number',
			locale: 'lc',
			currency: 'currency_code',
			recurrence: 'p3',
			period: 't3',
			callback: 'notify_url',
			button_id: 'hosted_button_id'
		},
		locales = {
			da_DK: { buynow: 'Køb nu', cart: 'Læg i indkøbsvogn', donate: 'Doner', subscribe: 'Abonner', item_name: 'Vare', number: 'Nummer', amount: 'Pris', quantity: 'Antal' },
			de_DE: { buynow: 'Jetzt kaufen', cart: 'In den Warenkorb', donate: 'Spenden', subscribe: 'Abonnieren', item_name: 'Artikel', number: 'Nummer', amount: 'Betrag', quantity: 'Menge' },
			en_AU: { buynow: 'Buy Now', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
			en_GB: { buynow: 'Buy Now', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
			en_US: { buynow: 'Buy Now', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
			es_ES: { buynow: 'Comprar ahora', cart: 'Añadir al carro', donate: 'Donar', subscribe: 'Suscribirse', item_name: 'Artículo', number: 'Número', amount: 'Importe', quantity: 'Cantidad' },
			es_XC: { buynow: 'Comprar ahora', cart: 'Añadir al carrito', donate: 'Donar', subscribe: 'Suscribirse', item_name: 'Artículo', number: 'Número', amount: 'Importe', quantity: 'Cantidad' },
			fr_CA: { buynow: 'Acheter', cart: 'Ajouter au panier', donate: 'Faire un don', subscribe: 'Souscrire', item_name: 'Objet', number: 'Numéro', amount: 'Montant', quantity: 'Quantité' },
			fr_FR: { buynow: 'Acheter', cart: 'Ajouter au panier', donate: 'Faire un don', subscribe: 'Souscrire', item_name: 'Objet', number: 'Numéro', amount: 'Montant', quantity: 'Quantité' },
			fr_XC: { buynow: 'Acheter', cart: 'Ajouter au panier', donate: 'Faire un don', subscribe: 'Souscrire', item_name: 'Objet', number: 'Numéro', amount: 'Montant', quantity: 'Quantité' },
			he_IL: { buynow: 'וישכע הנק', cart: 'תוינקה לסל ףסוה', donate: 'םורת', subscribe: 'יונמכ ףרטצה', item_name: 'טירפ', number: 'רפסמ', amount: 'םוכס', quantity: 'מותכ' },
			id_ID: { buynow: 'Beli Sekarang', cart: 'Tambah ke Keranjang', donate: 'Donasikan', subscribe: 'Berlangganan', item_name: 'Barang', number: 'Nomor', amount: 'Harga', quantity: 'Kuantitas' },
			it_IT: { buynow: 'Paga adesso', cart: 'Aggiungi al carrello', donate: 'Donazione', subscribe: 'Iscriviti', item_name: 'Oggetto', number: 'Numero', amount: 'Importo', quantity: 'Quantità' },
			ja_JP: { buynow: '今すぐ購入', cart: 'カートに追加', donate: '寄付', subscribe: '購読', item_name: '商品', number: '番号', amount: '価格', quantity: '数量' },
			nl_NL: { buynow: 'Nu kopen', cart: 'Aan winkelwagentje toevoegen', donate: 'Doneren', subscribe: 'Abonneren', item_name: 'Item', number: 'Nummer', amount: 'Bedrag', quantity: 'Hoeveelheid' },
			no_NO: { buynow: 'Kjøp nå', cart: 'Legg til i kurv', donate: 'Doner', subscribe: 'Abonner', item_name: 'Vare', number: 'Nummer', amount: 'Beløp', quantity: 'Antall' },
			pl_PL: { buynow: 'Kup teraz', cart: 'Dodaj do koszyka', donate: 'Przekaż darowiznę', subscribe: 'Subskrybuj', item_name: 'Przedmiot', number: 'Numer', amount: 'Kwota', quantity: 'Ilość' },
			pt_BR: { buynow: 'Comprar agora', cart: 'Adicionar ao carrinho', donate: 'Doar', subscribe: 'Assinar', item_name: 'Produto', number: 'Número', amount: 'Valor', quantity: 'Quantidade' },
			ru_RU: { buynow: 'Купить сейчас', cart: 'Добавить в корзину', donate: 'Пожертвовать', subscribe: 'Подписаться', item_name: 'Товар', number: 'Номер', amount: 'Сумма', quantity: 'Количество' },
			sv_SE: { buynow: 'Köp nu', cart: 'Lägg till i kundvagn', donate: 'Donera', subscribe: 'Abonnera', item_name: 'Objekt', number: 'Nummer', amount: 'Belopp', quantity: 'Antal' },
			th_TH: { buynow: 'ซื้อทันที', cart: 'เพิ่มลงตะกร้า', donate: 'บริจาค', subscribe: 'บอกรับสมาชิก', item_name: 'ชื่อสินค้า', number: 'รหัสสินค้า', amount: 'ราคา', quantity: 'จำนวน' },
			tr_TR: { buynow: 'Hemen Alın', cart: 'Sepete Ekleyin', donate: 'Bağış Yapın', subscribe: 'Abone Olun', item_name: 'Ürün', number: 'Numara', amount: 'Tutar', quantity: 'Miktar' },
			zh_CN: { buynow: '立即购买', cart: '添加到购物车', donate: '捐赠', subscribe: '租用', item_name: '物品', number: '编号', amount: '金额', quantity: '数量' },
			zh_HK: { buynow: '立即買', cart: '加入購物車', donate: '捐款', subscribe: '訂用', item_name: '項目', number: '號碼', amount: '金額', quantity: '數量' },
			zh_TW: { buynow: '立即購', cart: '加到購物車', donate: '捐款', subscribe: '訂閱', item_name: '商品', number: '商品編號', amount: '單價', quantity: '數量' },
			zh_XC: { buynow: '立即购买', cart: '添加到购物车', donate: '捐赠', subscribe: '租用', item_name: '物品', number: '编号', amount: '金额', quantity: '数量' }
		},
		validateFieldHandlers = {
			required : { message: 'The %s field is required' },
			numericRegex : { regex : /^[0-9]+$/, message : 'The %s field must contain only numbers.' },
			alphaRegex :  { regex : /^[a-z]+$/i, message : 'The %s field must only contain alphabetical characters.' },
			alphaNumericRegex : { regex : /^[a-z0-9]+$/i, message : 'The %s field must only contain alpha-numeric characters.' }
		};

	if (!PAYPAL.apps.ButtonFactory) {

		/**
		 * Initial config for the app. These values can be overridden by the page.
		 */
		app.config = {
			labels: {}
		};

		/**
		 * A count of each type of button on the page
		 */
		app.buttons = {
			buynow: 0,
			cart: 0,
			donate: 0,
			qr: 0,
			subscribe: 0
		};

		/**
		 * Renders a button in place of the given element
		 *
		 * @param business {Object} The ID or email address of the merchant to create the button for
		 * @param raw {Object} An object of key/value data to set as button params
		 * @param type (String) The type of the button to render
		 * @param parent {HTMLElement} The element to add the button to (Optional)
		 * @return {HTMLElement}
		 */
		app.create = function (business, raw, type, parent) {
			var data = new DataStore(), button, key, env;

			if (!business) { return false; }

			// Normalize the data's keys and add to a data store
			for (key in raw) {
				data.add(prettyParams[key] || key, raw[key].value || raw[key], raw[key].isEditable, raw[key].hasOptions, raw[key].displayOrder);
			}

			// Defaults
			type = type || 'buynow';
			env = "www";

			if (data.items.env && data.items.env.value) {
				env += "." + data.items.env.value;
			}

			if (data.items.hosted_button_id) {
				data.add('cmd', '_s-xclick');
			// Cart buttons
			} else if (type === 'cart') {
				data.add('cmd', '_cart');
				data.add('add', true);
			// Donation buttons
			} else if (type === 'donate') {
				data.add('cmd', '_donations');
			// Subscribe buttons
			} else if (type === 'subscribe') {
				data.add('cmd', '_xclick-subscriptions');

				// TODO: "amount" cannot be used in prettyParams since it's overloaded
				// Find a better way to do this
				if (data.items.amount && !data.items.a3) {
					data.add('a3', data.items.amount.value);
				}
			// Buy Now buttons
			} else {
				data.add('cmd', '_xclick');
			}

			// Add common data
			data.add('business', business);
			data.add('bn', bnCode.replace(/\{type\}/, type));
			data.add('env',  env);

			// Build the UI components
			if (type === 'qr') {
				button = buildQR(data, data.items.size);
				data.remove('size');
			} else {
				button = buildForm(data, type);
			}
			// Inject CSS
			injectCSS();

			// Register it
			this.buttons[type] += 1;

			// Add it to the DOM
			if (parent) {
				parent.appendChild(button);
			}

			return button;
		};


		PAYPAL.apps.ButtonFactory = app;
	}


	/**
	 * Injects button CSS in the <head>
	 *
	 * @return {void}
	 */
	function injectCSS() {
		var css, styleEl, paypalButton, paypalInput;

		if (document.getElementById('paypal-button')) {
			return;
		}

		css = '';
		styleEl = document.createElement('style');
		paypalButton = '.paypal-button';
		paypalInput = paypalButton + ' button';

		css += paypalButton + ' { white-space: nowrap; }';

		css += paypalButton + ' .field-error {  border: 1px solid #FF0000; }';
		css += paypalButton + ' .hide { display: none; }';
		css += paypalButton + ' .error-box { background: #FFFFFF; verflow: scroll; border: 1px solid #DADADA; border-radius: 5px; padding: 8px; display: inline-block; }';

		css += paypalInput + ' { white-space: nowrap; overflow: hidden; border-radius: 13px; font-family: "Arial", bold, italic; font-weight: bold; font-style: italic; border: 1px solid #ffa823; color: #0E3168; background: #ffa823; position: relative; text-shadow: 0 1px 0 rgba(255,255,255,.5); cursor: pointer; z-index: 0; }';
		css += paypalInput + ':before { content: " "; position: absolute; width: 100%; height: 100%; border-radius: 11px; top: 0; left: 0; background: #ffa823; background: -webkit-linear-gradient(top, #FFAA00 0%,#FFAA00 80%,#FFF8FC 100%); background: -moz-linear-gradient(top, #FFAA00 0%,#FFAA00 80%,#FFF8FC 100%); background: -ms-linear-gradient(top, #FFAA00 0%,#FFAA00 80%,#FFF8FC 100%); background: linear-gradient(top, #FFAA00 0%,#FFAA00 80%,#FFF8FC 100%); z-index: -2; }';
		css += paypalInput + ':after { content: " "; position: absolute; width: 98%; height: 60%; border-radius: 40px 40px 38px 38px; top: 0; left: 0; background: -webkit-linear-gradient(top, #fefefe 0%, #fed994 100%); background: -moz-linear-gradient(top, #fefefe 0%, #fed994 100%); background: -ms-linear-gradient(top, #fefefe 0%, #fed994 100%); background: linear-gradient(top, #fefefe 0%, #fed994 100%); z-index: -1; -webkit-transform: translateX(1%);-moz-transform: translateX(1%); -ms-transform: translateX(1%); transform: translateX(1%); }';
		css += paypalInput + '.small { padding: 3px 15px; font-size: 12px; }';
		css += paypalInput + '.large { padding: 4px 19px; font-size: 14px; }';

		styleEl.type = 'text/css';
		styleEl.id = 'paypal-button';

		if (styleEl.styleSheet) {
			styleEl.styleSheet.cssText = css;
		} else {
			styleEl.appendChild(document.createTextNode(css));
		}

		document.getElementsByTagName('head')[0].appendChild(styleEl);
	}


	/**
	 * Builds the form DOM structure for a button
	 *
	 * @param data {Object} An object of key/value data to set as button params
	 * @param type (String) The type of the button to render
	 * @return {HTMLElement}
	 */
	function buildForm(data, type) {
		var form = document.createElement('form'),
			btn = document.createElement('button'),
			hidden = document.createElement('input'),
			paraElem = document.createElement('p'),
			labelElem = document.createElement('label'),
			inputTextElem = document.createElement('input'),
			selectElem = document.createElement('select'),
			optionElem = document.createElement('option'),
			items = data.items,
			optionFieldArr = [],
			formError = 0,
			item, child, label, input, key, size, locale, localeText, MiniCart, btnText, selector, optionField, fieldDetails = {}, fieldDetail, fieldValue, field, labelText, addEventMethodName;

		form.method = 'post';
		form.action = paypalURL.replace('{env}', data.items.env.value);
		form.className = 'paypal-button';
		form.target = '_top';

		var divElem = document.createElement('div');
		divElem.className = 'hide';
		divElem.id = 'errorBox';
		form.appendChild(divElem);

		inputTextElem.type = 'text';
		inputTextElem.className = 'paypal-input';
		paraElem.className = 'paypal-group';
		labelElem.className = 'paypal-label';
		selectElem.className = 'paypal-select';

		hidden.type = 'hidden';

		size = items.size && items.size.value || 'large';
		locale = items.lc && items.lc.value || 'en_US';
		localeText = locales[locale] || locales.en_US;
		btnText = localeText[type];

		if (data.items.text) {
			btnText = data.items.text.value;
			data.remove('text');
		}
		for (key in items) {
			item = items[key];
			if (item.hasOptions) {
				optionFieldArr.push(item);
			} else if (item.isEditable) {
				input = inputTextElem.cloneNode(true);
				input.name = item.key;
				input.value = item.value;

				label = labelElem.cloneNode(true);
				labelText = app.config.labels[item.key] || localeText[item.key];
				label.htmlFor = item.key;
				label.appendChild(document.createTextNode(labelText));
				label.appendChild(input);

				child = paraElem.cloneNode(true);
				child.appendChild(label);
				form.appendChild(child);
			} else {
				input = child = hidden.cloneNode(true);
				input.name = item.key;
				input.value = item.value;
				form.appendChild(child);
			}
		}
		optionFieldArr = sortOptionFields(optionFieldArr);
		for (key in optionFieldArr) {
			item = optionFieldArr[key];
			if (optionFieldArr[key].hasOptions) {
				fieldDetails = item.value;
				if (fieldDetails.options.length > 1) {
					input = hidden.cloneNode(true);
					//on - Option Name
					input.name = 'on' + item.displayOrder;
					input.value = fieldDetails.label;
				
					selector = selectElem.cloneNode(true);
					//os - Option Select
					selector.name = 'os' + item.displayOrder;

					for (fieldDetail in fieldDetails.options) {
						fieldValue = fieldDetails.options[fieldDetail];
						if (typeof fieldValue === 'string') {
							optionField = optionElem.cloneNode(true);
							optionField.value = fieldValue;
							optionField.appendChild(document.createTextNode(fieldValue));
							selector.appendChild(optionField);
						} else {
							for (field in fieldValue) {
								optionField = optionElem.cloneNode(true);
								optionField.value = field;
								optionField.appendChild(document.createTextNode(fieldValue[field]));
								selector.appendChild(optionField);
							}
						}
					}
					label = labelElem.cloneNode(true);
					labelText = fieldDetails.label || item.key;
					label.htmlFor = item.key;
					label.appendChild(document.createTextNode(labelText));
					label.appendChild(selector);
					label.appendChild(input);
				} else {
					label = labelElem.cloneNode(true);
					labelText = fieldDetails.label || item.key;
					label.htmlFor = item.key;
					label.appendChild(document.createTextNode(labelText));
					
					input = hidden.cloneNode(true);
					input.name = 'on' + item.displayOrder;
					input.value = fieldDetails.label;
					label.appendChild(input);
					
					input = inputTextElem.cloneNode(true);
					input.name = 'os' + item.displayOrder;
					input.value = fieldDetails.options[0] || '';
					input.setAttribute('data-label', fieldDetails.label);

					if (fieldDetails.required) {
						input.setAttribute('data-required', 'required');
					}
					//TODO Need to add complex validation
					if (fieldDetails.pattern && validateFieldHandlers[fieldDetails.pattern]) {
						input.setAttribute('data-pattern', fieldDetails.pattern);
					}
					label.appendChild(input);
				}
				child = paraElem.cloneNode(true);
				child.appendChild(label);

				form.appendChild(child);
			}
		}

		// Safari won't let you set read-only attributes on buttons.
		try {
			btn.type = 'submit';
		} catch (e) {
			btn.setAttribute('type', 'submit');
		}
		btn.className = 'paypal-button ' + size;
		btn.appendChild(document.createTextNode(btnText));
		form.appendChild(btn);

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			if (validateFields(form.getElementsByTagName('input'))) {
				form.submit();
			}
		}, false);

		// If the Mini Cart is present then register the form
		if ((MiniCart = PAYPAL.apps.MiniCart) && data.items.cmd.value === '_cart') {

			if (!MiniCart.UI.itemList) {
				MiniCart.render();
			}

			MiniCart.bindForm(form);
		}

		return form;
	}

	/**
	 * Validate all input fields
	 */
	function validateFields(fields) {
		var field, fieldLabel, patternName, errors = [], errorBox = document.getElementById('errorBox');
		for (var i = 0, len = fields.length; i < len; i++) {
			field = fields[i];
			field.className = 'paypal-input';
			
			fieldLabel = field.getAttribute('data-label');
			patternName = field.getAttribute('data-pattern');
			if (!checkField(field)) {
				errors.push(validateFieldHandlers.required.message.replace('%s', fieldLabel));
				field.className = field.className + ' field-error';
			} else if (!checkPattern(field, patternName)) {
				errors.push(validateFieldHandlers[patternName].message.replace('%s', fieldLabel));
			}
		}
		if (errors.length === 0) {
			errorBox.className = 'hide';
			return true;
		} else {
			errorBox.className = 'error-box';
			errorBox.innerHTML = displayErrorMsg(errors);
			return false;
		}
	}

	/**
	 * Check each field for required option
	 */
	function checkField(field) {
		if (field.getAttribute('data-required'))
		{
			field.value = field.value ? field.value.trim() : '';
			return !(field.value === '');
		}
		return true;
	}

	/**
	 * Check each field value with pattern
	 */
	function checkPattern(field, patternName) {
		var pattern;
		var patternKey = field.getAttribute('data-pattern');
		var validateData = validateFieldHandlers[patternName];
		if (patternKey && validateData) {
			pattern = new RegExp(validateData.regex);
			field.className = field.className + ' field-error';
			return pattern.test(field.value);
		}
		return true;
	}

	/**
	 * Display all error message
	 */
	function displayErrorMsg(errors) {
		var errMsg = '<ul>';
		for (var i = 0; i < errors.length; i++) {
			errMsg += "<li>" + errors[i] + "</li>";
		}
		return errMsg + "</ul>";
	}

	/**
	 * Sort Optional Fields by display order
	 */
	function sortOptionFields(optionFieldArr) {
		optionFieldArr.sort(function (a, b) {
			return a.displayOrder - b.displayOrder;
		});
		return optionFieldArr;
	}
	/**
	 * Builds the image for a QR code
	 *
	 * @param data {Object} An object of key/value data to set as button params
	 * @param size {String} The size of QR code's longest side
	 * @return {HTMLElement}
	 */
	function buildQR(data, size) {
		var baseUrl = paypalURL.replace('{env}', data.items.env.value),
			img = document.createElement('img'),
			url = baseUrl + '?',
			pattern = 13,
			items = data.items,
			item, key;

		// QR defaults
		size = size && size.value || 250;

		for (key in items) {
			item = items[key];
			url += item.key + '=' + encodeURIComponent(item.value) + '&';
		}

		url = encodeURIComponent(url);

		img.src = qrCodeURL.replace('{env}', data.items.env.value).replace('{url}', url).replace('{pattern}', pattern).replace('{size}', size);

		return img;
	}


	/**
	 * Utility function to polyfill dataset functionality with a bit of a spin
	 *
	 * @param el {HTMLElement} The element to check
	 * @return {Object}
	 */
	function getDataSet(el) {
		var dataset = {}, attrs, attr, matches, len, i, j;
		var customFieldMap = {}, customSelectMap = {}, optionCount = 0, valueCount = {}, optionArray = [], optionMap = {};
		if ((attrs = el.attributes)) {
			for (i = 0, len = attrs.length; i < len; i++) {
				attr = attrs[i];
				if ((matches = attr.name.match(/^data-OPTION([0-9])([a-z]+)?/i))) {
					if (matches[2] === 'name') {
						optionCount++;
					}
					dataset["option_" + matches[1]] = {
						value: '',
						hasOptions: true,
						displayOrder: parseInt(matches[1], 10)
					};
					customFieldMap["value_" + matches[1] + "_" + matches[2]] = attr.value;
				} else if ((matches = attr.name.match(/^data-L_OPTION([0-9])([a-z]+)([0-9])?/i))) {
					if (matches[2] === 'select') {
						valueCount[matches[1]] = (valueCount[matches[1]] ? valueCount[matches[1]] + 1 : 1);
					}
					customSelectMap["dropdown_" + matches[1] + "_option_" + matches[2] + "_" + matches[3]] = attr.value;
				} else if ((matches = attr.name.match(/^data-([a-z0-9_]+)(-options)-([0-9])?/i))) {
					dataset[matches[1]] = {
						value: attr.value,
						hasOptions: !!matches[2],
						displayOrder: parseInt(matches[3], 10)
					};
				} else if ((matches = attr.name.match(/^data-([a-z0-9_]+)(-editable)?/i))) {
					dataset[matches[1]] = {
						value: attr.value,
						isEditable: !!matches[2]
					};
				}
			}
		}

		for (i = 0; i < optionCount; i++) {
			optionArray = [];
			for (j = 0; j < valueCount[i]; j++) {
				optionMap = {};
				if (customSelectMap["dropdown_" + i + "_option_price_" + j] === undefined) {
					optionArray.push(customSelectMap["dropdown_" + i + "_option_select_" + j]);
				} else {
					optionMap[customSelectMap["dropdown_" + i + "_option_select_" + j]] = customSelectMap["dropdown_" + i + "_option_select_" + j] + " " + customSelectMap["dropdown_" + i + "_option_price_" + j];
					optionArray.push(optionMap);
				}
			}
			dataset['option_' + i].value = { "options" : '', "label" : customFieldMap["value_" + i + "_name"], "required" : customFieldMap["value_" + i + "_required"], "pattern" : customFieldMap["value_" + i + "_pattern"] };
			dataset['option_' + i].value.options = optionArray;
		}
		return dataset;
	}

	/**
	 * A storage object to create structured methods around a button's data
	 */
	function DataStore() {
		this.items = {};

		this.add = function (key, value, isEditable, hasOptions, displayOrder) {
			this.items[key] = {
				key: key,
				value: value,
				isEditable: isEditable,
				hasOptions : hasOptions,
				displayOrder : displayOrder
			};
		};

		this.remove = function (key) {
			delete this.items[key];
		};
	}


	// Init the buttons
	if (typeof document !== 'undefined') {
		var ButtonFactory = PAYPAL.apps.ButtonFactory,
			nodes = document.getElementsByTagName('script'),
			node, data, type, business, i, len, buttonId;

		for (i = 0, len = nodes.length; i < len; i++) {
			node = nodes[i];

			if (!node || !node.src) { continue; }

			data = node && getDataSet(node);
			type = data && data.button && data.button.value;
			business = node.src.split('?merchant=')[1];

			if (business) {
				ButtonFactory.create(business, data, type, node.parentNode);

				// Clean up
				node.parentNode.removeChild(node);
			}
		}
	}


}(document));


// Export for CommonJS environments
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = PAYPAL;
}
