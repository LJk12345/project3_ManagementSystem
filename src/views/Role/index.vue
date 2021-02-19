<template>
	<div>
		<el-row :gutter="20">
			<el-col v-for="item in roles" :key="item.role_id" :span="6">
				<el-card shadow="hover">
					<span v-text="item.role_name"></span>
					<div class="button-wrapper">
						<el-button type="text" @click="beginUpdate(item)"><i
							class="el-icon-edit-outline"></i></el-button>
						<el-button type="text" @click="remove(item)"><i
							class="el-icon-delete"></i></el-button>
						<el-button type="text" @click="beginRoleFuncConfig(item.role_id)"><i
							class="el-icon-setting"></i></el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="btn-add" shadow="hover" @click.native="beginAdd">
					<span><i class="el-icon-plus"></i></span>
				</el-card>
			</el-col>
		</el-row>
		<el-drawer
			class="custom-drawer"
			:modal="false"
			:visible.sync="edit2.drawer"
			size="590px"
			:showClose="false">
			<h3 slot="title" >角色功能分配</h3>
			<el-tree class="custom-tree" :data="edit2.treeData" default-expand-all
			         :expand-on-click-node="false">
				<span class="custom-tree-node" slot-scope="{node, data}"
				      :class="{parent: data.func_key===''}">
					<span>
						<i v-if="data.func_key !==''" class="el-icon-paperclip"></i>
				                <span v-text="data.func_name"></span>
					</span>
					<span class="switch-wrapper">
						<el-switch v-model="data.open" @change="switchChangeHandler(data)"></el-switch>
					</span>
				</span>
			</el-tree>
			<div class="drawer-footer">
				<el-button type="primary" @click="roleFuncConfig">确定</el-button>
				<el-button @click="edit2.drawer=false">取消</el-button>
			</div>
		</el-drawer>
		<el-dialog :modal="false" :visible.sync="edit.isEdit" :title="edit.mode? '角色管理-新增' : '角色管理-修改'">
			<el-form ref="form" :model="edit.model" label-width="140px" :rules="rules">
				<el-form-item label="用户名称" prop="role_name">
					<el-input placeholder="请输入要添加的用户名" v-model.trim="edit.model.role_name">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="edit.isEdit = false">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from "vuex";


        let {mapState: mapStateFromRole, mapActions: mapActionsFromRole} = createNamespacedHelpers("role");  //方法映射语法导入";
        //        let {mapState: mapStateFromFunc,mapActions:mapActionsFromFunc}=createNamespacedHelpers("func");
        let {mapGetters: mapGettersFromFunc, mapActions: mapActionsFromFunc} = createNamespacedHelpers("func");
        //        import {mapState,mapActions} from 'vuex';
        //        mapState("role",[映射谁])
        //        mapState("func",[映射谁])

        export default {
                name: "Role",
                data(){
                        return {
                                edit: {
                                        mode: true,//新增
                                        isEdit: false,//是否编辑
                                        model: {role_id: 0, role_name: ""},
                                },
                                edit2: {
                                        drawer: false,
                                        model: {role_id: 0, role_func_ids: ""},
                                        treeData: []
                                },
                                rules: {
                                        role_name: [{
                                                validator: (rule, value, callback) =>{
                                                        //ES6中的解构赋值
                                                        let {role_name, role_id,} = this.edit.model;
                                                        if(value.length === 0){
                                                                callback(new Error('*角色不能为空'))
                                                        }
                                                        else if(value.length < 2 || value.length > 20){
                                                                callback(new Error('*角色长度2-20'))
                                                        }
                                                        else if(this.roles.some(item => item.role_id !== role_id && item.role_name === role_name)){
                                                                callback(new Error("角色已经存在"))
                                                        }
                                                        else{
                                                                callback();
                                                        }
                                                },
                                                trigger: "blur"
                                        }
                                        ]
                                }
                        }
                },
                computed: {
                        ...mapStateFromRole(["roles"]),     //state放在computed中
                        ...mapGettersFromFunc(["listToTree"])
                },
                async created(){
                        await this.init();
                        await this.initFunc();
                },
                methods: {
                        ...mapActionsFromRole(["init", "add", "update", "removeRole"]),       //要放在methods才能调用
                        ...mapActionsFromFunc({initFunc: "init"}),
                        remove(node){
                                this.$confirm(`你确定要删除"${node.role_name}"吗?`, "警告", {type: "warning"})
                                        .then(async() =>{
                                                await this.removeRole(node.role_id)
                                                this.$message({
                                                        message: "删除成功! ",
                                                        type: "success"
                                                })
                                        }).catch(() =>{
                                })
                        },
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                this.edit.mode = true;
                                this.edit.model.role_id = 0;
                                this.edit.model.role_name = "";
                                this.edit.isEdit = true;
                        },
                        beginUpdate(node){
                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                this.edit.mode = false;
                                this.edit.model.role_id = node.role_id;
                                this.edit.model.role_name = node.role_name;
                                this.edit.isEdit = true;
                        },

                        save(){
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;
                                        if(this.edit.mode){
                                              await  this.add(this.edit.model);
                                                this.$message({
                                                        message: `"${this.edit.model.role_name}" 角色，新增成功!`,
                                                        type: "success"
                                                });
                                        }else{
                                                await this.update(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `"${this.edit.model.role_name}" 角色，修改成功！`,
                                                        type: "success"
                                                });
                                        }
                                        this.edit.isEdit = false;
                                })
                        },
                        //更新模型树
                        updateTreeData(roleFuncIds){
                                let result = JSON.parse(JSON.stringify(this.listToTree));
                                result.forEach(item =>{
                                        item.open = roleFuncIds.indexOf(item.func_id )!== -1;
                                        item.children && item.children.forEach(item2 => item2.open = roleFuncIds.indexOf(item2.func_id) !== -1);
                                });
                                this.edit2.treeData = result;
                        },
	                //获取角色的权限开启情况
                        async beginRoleFuncConfig(role_id){
                                let roleFuncs = await this.$http({url: "/role_function/list/" + role_id});
                                let roleFuncIds = roleFuncs.reduce((result, item) =>{
                                        result.push(item.func_id);
                                        return result;
                                }, []);
                                this.updateTreeData(roleFuncIds);
                                this.edit2.model.role_func_ids = "";
                                this.edit2.model.role_id = role_id;
                                this.edit2.drawer = true;
                        },
	                //权限开关状态
                        switchChangeHandler(node){
                                if(node.func_key === ""){     //叶子节点
                                        node.children && node.children.forEach(item => item.open = node.open);
                                }else{                                      //非叶子节点
                                        let parent = this.edit2.treeData.find(item => item.func_id === node.func_fid);
                                        parent.open = parent.children.every(item => item.open);
                                }
                        },
                        //角色功能设置
                        async roleFuncConfig(){
                                //发ajax前统计树中所有open节点的func_id
                                let func_ids = [];
                                this.edit2.treeData.forEach(item =>{
                                        if(item.open) func_ids.push(item.func_id);
                                        item.children && item.children.forEach(item2 =>{
                                                if(item2.open) func_ids.push(item2.func_id);
                                        })
                                });
                                this.edit2.model.role_func_ids = func_ids.join(",");
                                //发ajax
                                await this.$http({
                                        method: "post",
                                        url: "/role_function/config",
                                        data: this.edit2.model
                                });
                                //ajax成功返回后的相应界面变化
                                this.edit2.drawer = false;
                                this.$message({message: "角色功能分配成功！", type: "success"})
                        }
                },
                watch: {
                        listToTree(){
                                this.edit2.drawer = false;
                                this.updateTreeData([]);
                        }
                }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>
	.custom-tree
		width: 500px
		margin: 20px 0 50px 50px
		span.custom-tree-node
			flex: 1
			display: flex
			justify-content: space-between
			align-items: center
			&.parent
				padding-right: 50px
				color: #0094ff

	.drawer-footer
		text-align: center
		margin-bottom: 10px
	.el-col
		margin-top: 10px;
		.el-card
			text-align: center;
			padding: 10% 0;
			background-color: deepskyblue;
			color: white
			position: relative
			font-size: 18px
			cursor: pointer
			&.btn-add
				color: black
				background-color: white
			.button-wrapper
				position: absolute
				bottom: 5px
				right: 5px
				.el-button
					padding: 0
					margin: 0 5px
					background-color: white
					font-size: 18px
</style>