<template>
	<el-container>
		<el-header>
			<el-form :inline="true">
				<el-form-item label="员工名字:">
					<el-input v-model="search.stf_name" clearable prefixIcon="el-icon-search"
					          placeholder="请输入搜索内容" @change="getStaff()"></el-input>
				</el-form-item>
				<el-form-item label="员工类型:">
					<el-select v-model="search.stf_category" @change="getStaff()">
						<el-option label="-所有类型-" :value="0"></el-option>
						<el-option
							v-for="item in getGroupByKey('staff_category')"
							:key="item.dic_id"
							:label="item.dic_name"
							:value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-button type="success" class="el-icon-plus" @click="beginAdd">新增</el-button>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="staffList" style="width: 100%" stripe border>
				<el-table-column type="index" align="center" width="70"></el-table-column>
				<el-table-column prop="stf_name" label="姓名" width="120"
				                 align="center"></el-table-column>
				<el-table-column label="职务" width="120" align="center">
					<template slot-scope="{row}">
						<span v-text="getGroupByKey('staff_category').find(item=>row.stf_category===item.dic_id).dic_name"></span>
					</template>
				</el-table-column>
				<el-table-column prop="stf_remark" label="备注">
					<template slot-scope="{row}">
						<span v-text="row.stf_remark==='' ? '暂无相关介绍' : row.stf_remark"
						      :class="{coler: row.stf_remark===''}"></span>
					</template>
				</el-table-column>
				<el-table-column label="员工状态" width="120" align="center">
					<template slot-scope="{row}">
						<span v-if="row.stf_invalid===1">在职</span>
						<span v-else style="color: red">离职</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="220">
					<template slot-scope="{row}">
						<el-button type="primary" @click="beginUpdate(row
							)">编辑
						</el-button>
						<el-button type="danger" v-if="row.stf_invalid===1"
						           @click="dimission(row)">离职
						</el-button>
						<el-button type="warning" v-else
						           @click="reinstate(row)">入职
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog :modal="false" :title="edit.mode ? '员工维护 - 新增' : '员工维护-修改'"
			           :visible.sync="edit.isEdit" width="700px" :close-on-click-modal="false"
			           :close-on-press-escape="false">
				<el-form :model="edit.model" :rules="rules" label-position label-width="140px"
				          ref="form" status-icon>
					<el-form-item label="员工名字: " prop="stf_name">
						<el-input v-model="edit.model.stf_name"
						          placeholder="请输入员工名字"></el-input>
					</el-form-item>
					<el-form-item label="员工类型: " prop="stf_category"  >
						<el-select v-model="edit.model.stf_category" placeholder="-请选择员工类型-">
							<el-option
								v-for="item in getGroupByKey('staff_category')"
								:key="item.dic_id"
								:label="item.dic_name"
								:value="item.dic_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="员工备注:">
						<el-input type="textarea" v-model="edit.model.stf_remark"
						          placeholder="请输入员工备注..." :rows="5"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="edit.isEdit = false">取 消</el-button>
					<el-button type="primary" @click="save">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
		<el-footer>
			<el-pagination
				background
				:total="pagination.total"
				@size-change="getStaff()"
				@current-change="getStaff(false)"
				:page-sizes="[5,8,10]"
				:page-size.sync='pagination.pageSize'
				:current-page.sync="pagination.currentPage"
				layout="prev,pager,next,jumper,->,total,sizes"
			>
			</el-pagination>
		</el-footer>
	</el-container>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from "vuex";
        let {mapGetters} = createNamespacedHelpers("dictionary")
        export default {
                name: "Staff",
                data(){
                        return {
                                staffList: [],
                                pagination: {
                                        pageSize: 5,
                                        currentPage: 1,
                                        total: 0,
                                },
                                search: {
                                        stf_category: 0,
                                        stf_name: ""
                                },
                                edit: {
                                        isEdit: false,
                                        mode: true,
                                        model: {
                                                stf_id: null,
                                                stf_name: "",
                                                stf_category: null,
                                                stf_remark: "",
                                                stf_invalid: -1
                                        }
                                },
                                rules: {
                                       stf_name: [
                                               { required: true, message: '*员工名字不能为空',trigger: 'blur'},
                                               {min: 2, max: 20, message: '*员工名字长度在2 到 20个字符', trigger: 'blur' }
                                       ],
                                        stf_category: [
	                                        { required: true, message: '*请选择职务',trigger: 'change'},
                                        ]
                                }
                        }
                },
                computed: {
                        ...mapGetters(["getGroupByKey"]),
                },
                methods: {
                        async getStaff(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        url: "/staff/list",
                                        method: "post",
                                        data: {
                                                ...this.search,
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: this.pagination.pageSize
                                        }
                                });
                                this.staffList = list;
                                this.pagination.total = total;
                        },
                        beginAdd(){
                                this.edit.mode = true;
                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                this.edit.model.stf_id = null;
                                this.edit.model.stf_name = "";
                                this.edit.model.stf_category = null;
                                this.edit.model.stf_remark = "";
                                this.edit.model.stf_invalid = 0;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(staff){
                                console.log(staff)
                                this.edit.mode = false;
                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                this.edit.model.stf_id = staff.stf_id;
                                this.edit.model.stf_name = staff.stf_name;
                                this.edit.model.stf_category = staff.stf_category;
                                this.edit.model.stf_remark = staff.stf_remark;
                                this.edit.model.stf_invalid = staff.stf_invalid;
                                this.edit.isEdit = true;
                        },
                        async save(){
                                this.$refs.form.validate(async valid=>{
                                        if(!valid) return;
                                        if(this.edit.mode){
                                                this.edit.model.stf_id = await this.$http({
                                                        url: "/staff/add",
                                                        method: 'post',
                                                        data: {
                                                                ...this.edit.model
                                                        }
                                                })
                                                this.staffList.push(Object.assign({}, this.edit.model))
                                                this.$message({
                                                        message: `"${this.edit.model.stf_name}" 员工添加成功!`,
                                                        type: "success"
                                                });
                                        }
                                        else{
                                                await this.$http({
                                                        url: "/staff/update",
                                                        method: 'post',
                                                        data: {
                                                                ...this.edit.model
                                                        }
                                                })
                                                let i = this.staffList.findIndex(item => item.stf_id === this.edit.model.stf_id)
                                                this.staffList.splice(i, 1, Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `"${this.edit.model.stf_name}" 员工添加成功!`,
                                                        type: "success"
                                                });
                                        }
                                        this.edit.isEdit = false;
                                })
                        },
//	                updateTeacher(id,category){
//                                console.log(id)
//                                console.log(category)
//                                switch(category){
//                                        case 4:
//                                                this.$store.state.teacher.staffTeacher.find(item =>item.stf_id===id).stf_invalid=0
//                                                break;
//                                        case 5:
//                                                this.$store.state.teacher.staffAdmin.findIndex(item =>item.stf_id===id).stf_invalid=0
//                                                break;
//                                        case 6:
//                                                this.$store.state.teacher.staffJob.find(item =>item.stf_id===id).stf_invalid=0
//                                                break;
//                                        default :
//                                                break;
//                                }
//	                },

	                //离职
                        dimission(stf){
                                this.$confirm(`确定要让员工:"${stf.stf_name}"离职吗？`, "提示", {type: "waring"})
                                        .then(async() =>{
                                                await this.$http({
                                                        url: "/staff/dimission/" + stf.stf_id
                                                })
                                                this.staffList.find(item =>item.stf_id === stf.stf_id).stf_invalid = 0
//                                                this.updateTeacher(stf.stf_id,stf.stf_category)
                                                this.$message({message: stf.stf_name + "员工离职成功!", type: "success"});
                                        }).catch(() =>{});
                        },
                        //入职
                        async reinstate(stf){
                                this.$confirm(`确定要让员工:"${stf.stf_name}"入职吗？`, "提示", {type: "waring"})
                                        .then(async() =>{
                                                await this.$http({
                                                        url: "/staff/reinstate/" + stf.stf_id
                                                })
                                                this.staffList.forEach(item =>{
                                                        if(item.stf_id === stf.stf_id) item.stf_invalid = 1
                                                })
                                                this.$message({message: stf.stf_name + "员工入职成功!", type: "success"});
                                        }).catch(() =>{});
                        }
                },
                created(){
                        this.getStaff();
                }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>
	.coler
		color: silver
	.el-container
		position: absolute
		left: 0
		top: 0
		height: 100%
		width: 100%
		.el-footer
			display: flex
			align-items: center
			.el-pagination
				flex-grow: 1
</style>