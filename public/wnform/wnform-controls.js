//字段解析
Vue.component('field-parse', {
	props: {
		name: String,
		field: Object,
		value: Object
	},
	template: document.getElementById('tpl-field-parse').innerHTML,
	data: () => ({}),
	methods: {}
});

//属性解析
Vue.component('attribute-parse', {
	props: {
		name: String,
		field: Object,
		value: Object
	},
	template: document.getElementById('tpl-attribute-parse').innerHTML,
	data() {
		return {
			data: this.value
		};
	},
	methods: {
	},
	watch: {
		data(value) {
			this.$emit('input', value);
		}
	}
});

//富文本
Vue.component('rich-text', {
	props: {
		value: String,
		placeholder: String,
	},
	template: '<textarea class="form-control"></textarea>',
	mounted() {
		const jqEl = $(this.$el);
		jqEl.summernote({
			tabsize: 2,
			height: 300,
			placeholder: this.placeholder
		});
		this.value && jqEl.code(this.value);
		jqEl.on('summernote.blur', () => {
			this.$emit('input', jqEl.code());
		});
		// jqEl.on('summernote.image.upload', function(we, files) {
		// 	// upload image to server and create imgNode...
		// 	jqEl.summernote('insertNode', imgNode);
		// });
	},
	destroyed() {
		$(this.$el).summernote('destroy');
	}
});

//按钮组
Vue.component('button-group', {
	props: {
		value: String,
		items: Array,
		name: String
	},
	data() {
		return {
			data: this.value
		};
	},
	template: document.getElementById('tpl-button-group').innerHTML,
	watch: {
		data(value) {
			this.$emit('input', value);
		}
	}
});