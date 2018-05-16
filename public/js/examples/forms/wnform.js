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

/**
 * 字段解析组件
 * @type {*}
 */
const FIELD_PARSE_CONTROL = {
	props: {field: Object},
	template: document.getElementById('field-parse').innerHTML,
	data: () => ({}),
	methods: {}
};

/**
 * 富文本组件
 * @type {*}
 */
const RICH_TEXT_CONTROL = {
	props: {
		value: String
	},
	template: '<textarea class="form-control"></textarea>',
	mounted() {
		const jqEl = $(this.$el);
		jqEl.summernote({
			tabsize: 2,
			height: 300,
		});
		this.value && jqEl.code(this.value);
		jqEl.on('summernote.blur', () => {
			this.$emit('input', jqEl.code());
		});
		// jqEl.on('summernote.change', (e) => {
		// 	console.log(jqEl.summernote('code'));
		// });
		// jqEl.on('summernote.image.upload', function(we, files) {
		// 	// upload image to server and create imgNode...
		// 	jqEl.summernote('insertNode', imgNode);
		// });
	},
	destroyed() {
		$(this.$el).summernote('destroy');
	}
};

const design = new Vue({
	el: document.getElementById('design'),
	components: {
		'field-parse': FIELD_PARSE_CONTROL,
		'rich-text': RICH_TEXT_CONTROL
	},
	data: () => {
		const form = {
			title: '新表单',
			description: '',
			fields: [],
			layoutStyle: 'horizontal'
		};
		return {
			//表单的配置
			form: form,

			//组件的配置
			fieldsConfig: control.get(),

			//选中的组件
			control: {
				name: 'form',
				options: form
			},
			chooseOptions: form,

			//window height
			winHeight: $(window).height()
		};
	},
	created() {
		window.addEventListener('resize', () => design.winHeight = $(window).height());
		console.log(this);
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
		//复制组件
		copyControl(control) {
			control = JSON.parse(JSON.stringify(control));
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
		},
		//获取组件标签css class列表
		getFieldLabelClass(control) {
			return ['control-label', {
				'col-sm-2': this.form.layoutStyle === 'horizontal'
			}];
		},
		//获取组件标签css class列表
		getFieldControlClass(control) {
			const col = 'col-sm-' + control.options.inputWidth;
			return [{[col]: this.form.layoutStyle === 'horizontal'}];
		},
		//获取FormGroup css class列表
		getFormGroupClass(control) {
			return {
				'selected': this.control === control,
				'form-hide': control.options.isHide
			};
		}
	}
});