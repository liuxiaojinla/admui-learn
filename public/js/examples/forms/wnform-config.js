window.control = (function () {
	const CONTROL_CONFIG = {};

	/**
	 * 添加组件
	 * @param name
	 * @param config
	 * @return {*}
	 */
	function put(name, config) {
		//老的options
		const oldOptions = config.options;
		//新的options
		const newOptions = {
			basic: {
				title: '基本配置',
				options: {
					title: {
						title: '标题',
						type: 'string',
						value: '标题'
					},
					tip: {
						title: '提示信息',
						type: 'string',
						value: ''
					}
				}
			},
			fill: {
				title: '填写配置',
				options: {}
			},
			layout: {
				title: '布局配置',
				options: {
					inputWidth: {
						title: '输入框宽度',
						type: 'radio',
						items: {
							'1': '10%',
							'2': '20%',
							'3': '30%',
							'4': '40%',
							'5': '50%',
							'6': '60%',
							'7': '70%',
							'8': '80%',
							'9': '90%',
							'10': '100%',
						},
						value: '10'
					}
				}
			},
			advanced: {
				title: '高级配置',
				options: {
					validate: {
						title: '错误提示',
						type: 'switch',
						value: false
					},
					validateText: {
						title: '提示信息',
						type: 'string',
						value: '',
						isShow: (options) => options.validate
					},
					isHide: {
						title: '隐藏组件',
						type: 'switch',
						value: false
					}
				}
			}
		};

		for (const gKey in oldOptions) {
			if (!oldOptions.hasOwnProperty(gKey)) continue;
			if (oldOptions[gKey] === undefined) {
				delete newOptions[gKey];
			} else {
				if (newOptions[gKey]) {
					const oldGroupOptions = oldOptions[gKey].options;
					const newGroupOptions = newOptions[gKey].options || {};
					for (const attrKey in oldGroupOptions) {
						if (!oldGroupOptions.hasOwnProperty(attrKey)) continue;
						if (oldGroupOptions[attrKey] === undefined) {
							delete newGroupOptions[attrKey];
						} else {
							newGroupOptions[attrKey] = Object.assign(newGroupOptions[attrKey] || {}, oldGroupOptions[attrKey]);
						}
					}
				} else {
					newOptions[gKey] = oldOptions[gKey];
				}
			}
		}

		config.options = newOptions;
		return CONTROL_CONFIG[name] = config;
	}

	/**
	 * 移除一个组件配置
	 * @param name
	 */
	function remove(name) {
		delete CONTROL_CONFIG[name];
	}

	/**
	 * 获取组件配置
	 */
	function get() {
		return CONTROL_CONFIG;
	}

	return {put: put, remove: remove, get: get};
})();

//表单
control.put('form', {
	title: '单行文本',
	options: {
		basic: {
			options: {
				description: {
					type: 'rich-text',
					value: ''
				}
			}
		},
		fill: undefined,
		layout: {
			options: {
				layoutStyle: {
					title: '排列方式',
					type: 'radio',
					items: {'vertical': '垂直', 'horizontal': '水平'},
					value: 'vertical'
				},
				inputWidth: undefined
			}
		},
		advanced: undefined,
	},
	isShow: false
});

//文本框
control.put('string', {
	title: '单行文本',
	options: {
		basic: {}
	}
});