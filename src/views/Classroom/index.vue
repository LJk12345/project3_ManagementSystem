<template>
	<el-container>
		<el-header>
			<div><span style="background-color: #67c23a"></span>闲置</div>
			<div><span style="background-color: #e6a23c"></span>使用中</div>
		</el-header>
		<el-row :gutter="20" style="margin-top: -20px">
			<el-col v-for="item in classrooms" :key="item.clsr_id" :span="6">
				<el-card shadow="hover" :class="{spare: item.clsr_occupy===1}">
					<span v-text="item.clsr_name" style="font-size: 25px"></span>
					<div class="button-wrapper">
							<el-button type="text" @click="beginUpdate(item)">
								<i class="el-icon-edit-outline"></i>
							</el-button>
							<el-button type="text" @click="removeClassroom(item)">
								<i class="el-icon-delete"></i>
							</el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="btn-add" shadow="hover" @click.native="beginAdd">
					<span><i class="el-icon-plus"></i></span>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog :modal="false" :visible.sync="edit.isEdit" :title="edit.mode ? '教室管理-新增' : '教室管理-修改'">
			<el-form ref="form" :model="edit.model" label-width="140px" :rules="rules">
				<el-form-item label="教室名称" prop="clsr_name">
					<el-input placeholder="请输入教室名称" v-model.trim="edit.model.clsr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="edit.isEdit=false">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from "vuex";

        let {mapState, mapActions} = createNamespacedHelpers("classroom");
        export default {
                name: "Classroom",
                data(){
                        return {
                                edit: {
                                        isEdit: false,
                                        mode: true,
                                        model: {clsr_id: null, clsr_name: "", clsr_occupy: 0}
                                },
                                rules: {
                                        clsr_name: [{
                                                validator: (rule, value, callback) =>{
                                                        //ES6中的解构赋值
                                                        let {clsr_name} = this.edit.model;
                                                        if(value.length === 0){
                                                                callback(new Error('*教室名称不能为空'))
                                                        }
                                                        else if(value.length < 2 || value.length > 20){
                                                                callback(new Error('*教室名称长度2-20'))
                                                        }
                                                        else if(this.$store.state.classroom.classrooms.some(item => item.clsr_name === clsr_name))
                                                                callback(new Error('* 教室名存在'));
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
                        ...mapState(["classrooms"]),
                },
                methods: {
                        ...mapActions(["add", "remove", "update"]),
                        beginAdd(){
                                this.edit.mode = true;
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.clsr_id = null;
                                this.edit.model.clsr_name = "";
                                this.edit.model.clsr_occupy = 0;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(classroom){
                                this.edit.mode = false;
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.clsr_id = classroom.clsr_id;
                                this.edit.model.clsr_name = classroom.clsr_name;
                                this.edit.model.clsr_occupy = classroom.clsr_occupy;
                                this.edit.isEdit = true;
                        },
                        save(){
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;
                                        if(this.edit.mode){
                                                await  this.add(this.edit.model);
                                                this.$message({
                                                        message: `"${this.edit.model.clsr_name}"教室新增成功!`,
                                                        type: "success"
                                                });
                                        }else{
                                                await this.update(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `"${this.edit.model.role_name}"教室修改成功！`,
                                                        type: "success"
                                                });
                                        }
                                        this.edit.isEdit = false;
                                })
                        },
                        removeClassroom(classroom){
                                console.log(classroom)
                                if(classroom.clsr_occupy === 1){
                                        this.$message.error('教室已被占用，无法删除！');
                                }else{
                                        this.$confirm(`你确定要删除"${classroom.clsr_name}"吗?`, "警告", {type: "warning"})
                                                .then(async() =>{
                                                        await this.remove(classroom.clsr_id)
                                                        this.$message({
                                                                message: "删除成功! ",
                                                                type: "success"
                                                        })
                                                }).catch(() =>{
                                        })
                                }
                        },
                },
                created(){

                }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>
	.el-header
		display: flex
		div
			margin-left: 20px
			span
				display inline-block
				vertical-align: middle
				margin-right: 10px
				width: 20px
				height: 20px

	.el-col
		margin-top: 20px
		.el-card:hover
			box-shadow: 0 0 10px 4px lightsteelblue
		.el-card
			text-align: center;
			padding: 10% 0;
			color: white
			background-color: #67c23a
			position: relative
			font-size: 14px
			cursor: pointer
			.button-wrapper
				position: absolute
				bottom: 5px
				right: 5px
				.el-button
					padding: 0
					margin: 0 5px
					font-size: 24px
					color: white
			&.btn-add
				color: black
				background-color: white

	.spare
		background-color: #e6a23c !important

</style>