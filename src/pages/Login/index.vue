<template>
	<el-container >
		<div class="logo-wrapper">
			<h1>潍科教学管理系统</h1>
	         </div>
		<el-form :rules="rules" :model="model" ref="form" status-icon>
			<h1>登录</h1>
			<el-form-item  prop="user_name" >
				<el-input  v-model="model.user_name">
					<template slot="prepend" > <i class="el-icon-s-custom"></i><span class="prepend-text">用户名</span></template>
				</el-input>
			</el-form-item>
			<el-form-item prop="user_pwd">
				<el-input  v-model="model.user_pwd" type="password">
					<template slot="prepend"><i class="el-icon-lock"></i><span class="prepend-text">密码</span></template>
				</el-input>
			</el-form-item>
			<el-form-item class="button-wrapper">
				<el-button plain  @click="login">登录</el-button>
			</el-form-item>
		</el-form>
	</el-container>
</template>

<script type="text/ecmascript-6">

        import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
        import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
        import ElContainer from "../../../node_modules/element-ui/packages/container/src/main.vue";

        export default {
                components: {
                        ElContainer,
                        ElForm,
                        ElButton},
                name: "Login",
	        data(){
                        var name = (rule, value, callback) => {
                                let r=/\w{4,20}/;
                                if(r.test(value)) {
                                        this.flag1=true;
                                        return  callback();
                                  }else {
	                                if(!value) {
                                               callback(new Error('用户名不能为空'));
	                                 }else if(!r.test(value)) {
	                                        callback(new Error('长度在 4 到 20 个字符'));
                                         }
                                        this.flag1=false;
                                }
                        };
                        var pwd = (rule, value, callback) => {
                                let r=/\w{3,20}/;
                                if(r.test(value)) {
                                        this.flag2=true;
                                        return callback();
                                }else {
                                        if(value === '') {
                                                callback(new Error('密码不能为空'));
                                        }else if(!r.test(value)) {
                                                callback(new Error('长度在 3 到 20 个字符'));
                                        }
                                        this.flag2=false;
                                }
                        };
                        return {
                                model: {
                                        user_name: "",
                                        user_pwd: "",
	                                flag1: false,
	                                flag2: false
                                },
                                rules: {
                                        user_name: [{validator: name, trigger: 'blur' }],
                                        user_pwd: [{ validator: pwd, trigger: 'blur' }]
                                }
                        }
                },
	        methods:{
                        async  login(){
                                        this.$refs.form.validate( async valid => {
                                                if (!valid) return;
                                                let token=await this.$http({
                                                        url: "/user/login",
                                                        method: "post",
                                                        data: this.model
                                                });
                                                sessionStorage.setItem("token", token);
                                                sessionStorage.setItem("user_name", this.model.user_name)
                                                this.$router.replace("/home")
                                        });
                                }
	                }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>

	@keyframes Inflection
		0% { transform: rotateY(0deg)}
		100% { transform: rotateY(30deg)}
	@keyframes Lapse_logo
		0% { transform: rotateY(-50%) translateX(0%) }
		100% { transform: translateY(-50%) translateX(10%) }
	@keyframes Lapse_form
		0%{transform:translateX(100%) }
		100% { transform: translateX(20%) }
	.el-container
		background: url("images/login.jpg") no-repeat
		background-size cover
		height 100%
		width 100%
		position relative
		.logo-wrapper
			perspective 500px //开启3d旋转(视距)
			position fixed
			top 50%
			right 42%
			transform translateY(-50%)
			animation-name Lapse_logo
			animation-duration 1s //持续时间
			animation-fill-mode forwards  //以动画结束状态为最终状态
			animation-delay 1s  //延迟
			h1
				animation-name Inflection
				animation-duration 1s
				animation-fill-mode forwards
				transform-origin left center
				white-space nowrap
				padding 10px 50px
				font-size 100px
				color white
				border-bottom  1px solid black
				text-shadow -10px 5px 10px black
				&:before
					content "潍科教学管理系统"
					opacity 0.5
					position  absolute
					left 0
					top 100%
					padding 10px 50px
					transform scaleY(-0.8)
		.el-form
			position: fixed
			text-align center
			top 30%
			left 50%
			border-radius 10px
			box-shadow 0 0 15px 1px
			width 400px
			padding 50px 80px
			animation-name Lapse_form
			animation-duration 1s
			animation-fill-mode forwards
			background-color white
			h1
				margin-bottom 20px
				font-size 25px
			span.prepend-text
				display inline-block
				width 60px
			.button-wrapper
				text-align center
</style>