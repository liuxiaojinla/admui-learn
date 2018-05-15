/**
 * 公共属性配置
 * @type {*}
 */
const COMMON_CONFIG = {
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
		options: {}
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

/**
 * 字段配置
 * @type {*}
 */
const FIELD_CONFIG = {
	'form': {
		title: '单行文本',
		options: {
			basic: {
				description: {
					type: 'rich-text',
					value: ''
				}
			},
			fill: undefined,
			layout: undefined,
			advanced: undefined,
		},
		isShow: false
	},
	'string': {
		title: '单行文本',
		options: {
			basic: {}
		}
	}
};

/**
 * 初始化字段配置
 * @return {*}
 */
function initFieldConfig() {
	const keys = Object.keys(FIELD_CONFIG);
	for (const name of keys) {
		const field = FIELD_CONFIG[name];
		const options = Object.assign({}, COMMON_CONFIG);
		for (const key in field.options) {
			if (!field.options.hasOwnProperty(key)) continue;

			if (field.options[key] === undefined) {
				delete options[key];
			} else {
				options[key] = Object.assign(options[key] || {}, field.options[key]);
			}
		}
		field.options = options;
	}
	return FIELD_CONFIG;
}

/**
 * 生成随机数
 * @param min
 * @param max
 * @return {*}
 */
function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 创建唯一id
 * @param prefix
 * @return {string}
 */
function createObjectId(prefix = '') {
	const k1 = random(100, 999);
	const k2 = new Date().getTime().toString().substring(10);
	const k3 = random(100, 999);
	return prefix + k1 + k2 + k3;
}

(function () {
	const previewWrapper = document.getElementById('preview');
	const controlWrapper = document.getElementById('control');
	const settingWrapper = document.getElementById('settings');

	function resize() {
		const height = $(window).height();
		previewWrapper.style.height = (height - 183) + 'px';
		controlWrapper.querySelector('.panel-body').style.height = (height - 223) + 'px';
		settingWrapper.querySelector('.panel-body').style.height = (height - 234) + 'px';
	}

	resize();

	window.addEventListener('resize', resize);
})();


const design = new Vue({
	el: document.getElementById('design'),
	data: () => {
		const form = {
			title: '新表单',
			description: '',
			fields: []
		};

		return {
			//表单的配置
			form: form,

			//组件的配置
			fieldsConfig: initFieldConfig(),

			//选中的组件
			control: {
				name: 'form',
				options: form
			},
			chooseOptions: form
		};
	},
	methods: {
		//获取组件配置列表
		getControlOptions(name) {
			const result = [], options = this.fieldsConfig[name].options || {};
			const gKeys = Object.keys(options);
			for (const gKey of gKeys) {
				const group = options[gKey];
				group.options = group.options || {};

				const item = {title: group.title, options: {}};
				for (const key in group.options) {
					if (!group.options.hasOwnProperty(key)) continue;
					item.options[key] = group.options[key];
				}
				result.push(item);
			}
			return result;
		},

		//获取组件配置值
		getControlOptionsValues(name) {
			const options = this.getControlOptions(name);
			const result = {};
			for (const group of options) {
				for (const key in group.options) {
					if (!group.options.hasOwnProperty(key)) continue;
					result[key] = group.options[key].value;
				}
			}
			return result;
		},

		//添加组件
		addControl(name) {
			const options = this.getControlOptionsValues(name);
			const control = {
				name: name,
				options: options,
				object_id: createObjectId(name)
			};
			this.form.fields.push(control);
			this.chooseControl(control);
		},

		//移除组件
		removeControl(index) {
			this.form.fields.splice(index, 1);
			this.chooseControl({name: 'form', options: this.form});
		},

		//选择组件
		chooseControl(control) {
			this.control = control;
			this.chooseOptions = control.options;
		},

		//是否显示属性
		isShowAttribute(attribute) {
			return !attribute.isShow || attribute.isShow(this.control.options) !== false;
		}

	}
});