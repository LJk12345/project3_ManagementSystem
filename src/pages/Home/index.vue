<template>
	<el-container class="page-container">
		<el-header height="80px">
			<h1>潍坊科技学院管理系统 V1.0.0</h1>
			<div>
				<span v-text="`欢迎${user_name}`"></span>
				<el-button size="small" @click="exit">退出</el-button>
			</div>
		</el-header>
		<el-container>
			<el-aside width="240px">
				<el-menu background-color="#606266" text-color="#fff" active-text-color="#ffd04b"
				         :default-active="activeFuncKey" @select="menuSelectHandler">
					<template v-for="item in menuData">
						<!--叶子节点显示-->
						<el-menu-item v-if="item.func_key" :index="item.func_key"
						              :key="item.func_id">
							<i class="el-icon-menu"></i>
							<span slot="title" v-text="item.func_name"></span>
						</el-menu-item>
						<!--非叶子节点显示-->
						<el-submenu v-else :index="item.func_id.toString()">
							<template slot="title">
								<i class="el-icon-setting"></i>
								<span v-text="item.func_name"></span>
							</template>
							<template v-if="item.children">
								<el-menu-item v-for="item2 in item.children"
								              :index="item2.func_key"
								              :key="item2.func_id">
									<i class="el-icon-menu"></i>
									<span slot="title"
									      v-text="item2.func_name"></span>
								</el-menu-item>
							</template>
						</el-submenu>
					</template>
				</el-menu>
			</el-aside>
			<el-container>
				<el-main>
					<!--v-model用于确定选中的标签，绑定值为选中选项卡的 name-->
					<el-tabs type="card" closable v-model="activeFuncKey" @tab-remove="tabRemove">
						<el-tab-pane v-for="func_key in activeFuncKeys" :key="func_key"
						             :name="func_key"
						             :label="menu.find(item => item.func_key === func_key).func_name"
						>
							<component :is="views[func_key]"></component>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<el-footer>版权所有&copy2009H5</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import views from "../../views"

        export default {
                name: "Home",
                data(){
                        return {
                                user_name: sessionStorage.getItem("user_name"),
                                views: views,
                                activeFuncKey: "",
                                activeFuncKeys: [],
                                menu: []
                        };
                },
                computed: {
                        menuData(){
                                let result = [];
                                this.menu.filter(item => item.func_fid === 0).forEach(item =>{
                                        let node = Object.assign({}, item);
                                        let children = this.menu.filter(item2 => item2.func_fid === item.func_id);
                                        if(children.length > 0){
                                                node.children = [];
                                                children.forEach(item2 => node.children.push(Object.assign({}, item2)));
                                        }
                                        result.push(node);
                                });
                                return result
                        }
                },
                methods: {
                        menuSelectHandler(index){
                                this.activeFuncKey = index;
                                console.log(index)
                                if(this.activeFuncKeys.indexOf(index) === -1){
                                        this.activeFuncKeys.push(index);
                                }

                        },
                        tabRemove(name){
                                this.activeFuncKeys.splice(this.activeFuncKeys.indexOf(name), 1);
                                console.log(this.activeFuncKeys)
                                if(this.activeFuncKeys.indexOf(this.activeFuncKey) === -1){
                                        this.activeFuncKey = this.activeFuncKeys[0] || ""
                                }
                        },
                        exit(){
                                sessionStorage.clear()
                                this.$router.replace("/login");
                                this.$message({
                                        showClose: true,
                                        message: "退出成功~~",
                                        type: 'success'
                                });
                        }
                },
                async created(){
                                this.$store.dispatch("dictionary/init")
	                        this.$store.dispatch("classroom/init")
//                                this.$store.dispatch("teacher/init")
                                this.menu = await this.$http({
                                        url: "/user/getmenu",
                                        method: "post",
                                });
                }
        };
</script>

<style lang="stylus" scoped>
	/*css编写格式:sass less stylus
	选择编写格式需要在style 中以lang=”“进行指定，
	使用时需要相应的用于打包的包
	*/
	/*
	stylus写法可省略{}、；、：,但建议保留:和;
	属性换行后缩进使用tab，只有属性和属性值之间可以加空格
	子类样式可直接写在父类样式之后需要进行缩进用tab
	.el-header
	        display flex
	        background-color #606266
		align-items center
		color #fff
		h1
			font-size 38px
	*/
	.page-container
		height: 100%;
		.el-header
			display: flex;
			background-color: #303133;
			align-items: center;
			justify-content: space-between;
			color: #fff;
			div
				display: flex;
				align-items: center;
				.el-button
					margin-left: 10px
					color: white
					background-color: rgba(0, 0, 0, 0.2);
			h1
				font-size 25px;
				white-space: nowrap

	.el-aside
		background-color: #606266;
		.el-menu
			border-right: none

	.el-footer
		display: flex;
		align-items: center;
		justify-content center;
		color: white;
		background-color: #909399;
		height: 45px !important

	.el-main
		position: relative
</style>