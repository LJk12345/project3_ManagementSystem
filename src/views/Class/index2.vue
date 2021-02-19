<template>
	<el-container>
		<el-header>
			<el-form :inline="true">
				<el-form-item label="班级名称:">
					<el-input v-model="search.cls_name" clearable prefixIcon="el-icon-search"
					          placeholder="请输入搜索内容" @change="getClass()"></el-input>
				</el-form-item>
				<el-form-item label="员工类型:">
					<el-select v-model="search.cls_dic_id_major" @change="getClass()">
						<el-option label="-所有专业-" :value="0"></el-option>
						<el-option
							v-for="item in getGroupByKey('class_major')"
							:key="item.dic_id"
							:label="item.dic_name"
							:value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级状态:">
					<el-select @change="getClass()" v-model="search.cls_status">
						<el-option label="-所有-" :value="0"></el-option>
						<el-option label="开课中" :value="1"></el-option>
						<el-option label="未开课" :value="2"></el-option>
						<el-option label="结课" :value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-button type="success" class="el-icon-plus" @click="beginAdd">新增</el-button>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="classList" style="width: 100%" stripe border>
				<el-table-column type="index" align="center" width="50"></el-table-column>
				<el-table-column prop="cls_name" label="班级名称" width="110"
				                 align="center"></el-table-column>
				<el-table-column label="班级专业" width="100" align="center">
					<template slot-scope="{row}">
						<span v-text=" getGroupByKey('class_major').find(item=>row.cls_dic_id_major===item.dic_id).dic_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="教学老师" width="100" align="center">
					<template slot-scope="{row}">
						<span v-text="$store.state.teacher.staffTeacher.find(item=>row.cls_stf_id_teacher===item.stf_id).stf_name "></span>
					</template>
				</el-table-column>
				<el-table-column label="教务老师" width="100" align="center">
					<template slot-scope="{row}">
						<span v-text="$store.state.teacher.staffAdmin.find(item=>row.cls_stf_id_admin===item.stf_id).stf_name "></span>
					</template>
				</el-table-column>
				<el-table-column label="就业老师" width="100" align="center">
					<template slot-scope="{row}">
						<span v-text="$store.state.teacher.staffJob.find(item=>row.cls_stf_id_job===item.stf_id).stf_name"></span>
					</template>
				</el-table-column>
				<el-table-column label="教室" width="100" align="center">
					<template slot-scope="{row}">
						<span v-text="row.cls_clsr_id ?   classrooms.find(item=>row.cls_clsr_id===item.clsr_id).clsr_name : ''"></span>
					</template>
				</el-table-column>
				<el-table-column prop="cls_begin" label="开课时间" width="120" align="center">
				</el-table-column>
				<el-table-column prop="cls_end" label="开课时间" width="120" align="center">
				</el-table-column>
				<el-table-column label="班级状态" width="100" align="center">
					<template slot-scope="{row}">
						<span v-if="!row.cls_begin" style="color: #e6a23c">未开课</span>
						<span v-else-if="!row.cls_end" style="color: #67c23a">开课中</span>
						<span v-else style="color: #ccc">结课</span>
					</template>
				</el-table-column>
				<el-table-column prop="cls_remark" label="备注" width="240">
					<template slot-scope="{row}">
						<span v-text="row.cls_remark==='' ? '暂无相关介绍' : row.cls_remark"
						      :class="{coler: row.cls_remark===''}"></span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="left" min-width="160">
					<template slot-scope="{row}">
						<el-button size="small" type="primary" @click="beginUpdate(row)"
						           class="el-icon-edit">修改
						</el-button>
						<el-button size="small" type="success" @click="beginCls(row)"
						           v-if="!row.cls_begin">开班
						</el-button>
						<el-button size="small" type="danger" @click="endCls(row)"
						           v-else-if="!row.cls_end">结课
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog :modal="false"
			           :visible.sync="edit.isEdit" width="700px" :close-on-click-modal="false"
			           :close-on-press-escape="false">
				<template slot="title">
					<span v-text="edit.mode===0 ? '班级维护 - 新增' : edit.mode===1 ? '班级维护-修改' : '开班'"></span>
				</template>
				<el-form :model="edit.model" :rules="rules" label-position label-width="100px"
				         ref="form" status-icon @validate="formValidateHandler">
					<div v-if="edit.mode!==2">
						<el-form-item label="班级名称: " prop="cls_name">
							<el-input v-model="edit.model.cls_name"
							          placeholder="请输入班级的名称"></el-input>
						</el-form-item>
						<el-form-item label="班级专业: " prop="cls_dic_id_major">
							<el-select v-model="edit.model.cls_dic_id_major"
							           placeholder="-请选择-">
								<el-option
									v-for="item in getGroupByKey('class_major')"
									:key="item.dic_id"
									:label="item.dic_name"
									:value="item.dic_id"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="教学老师: " prop="cls_stf_id_teacher">
							<el-select v-model="edit.model.cls_stf_id_teacher"
							           placeholder="-请选择-">
								<el-option
									v-for="item in $store.state.teacher.staffTeacher"
									:key="item.stf_id"
									:label="item.stf_name"
									:value="item.stf_id"
									:disabled="!edit.model.cls_end && item.stf_invalid===0"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="教务老师: " prop="cls_stf_id_admin">
							<el-select v-model="edit.model.cls_stf_id_admin"
							           placeholder="-请选择-">
								<el-option
									v-for="item in $store.state.teacher.staffAdmin"
									:key="item.stf_id"
									:label="item.stf_name"
									:value="item.stf_id"
									:disabled="!edit.model.cls_end && item.stf_invalid===0"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="就业老师: " prop="cls_stf_id_job" >
							<el-select v-model="edit.model.cls_stf_id_job"
							           placeholder="-请选择-">
								<el-option
									v-for="item in $store.state.teacher.staffJob"
									:key="item.stf_id"
									:label="item.stf_name"
									:value="item.stf_id"
									:disabled="!edit.model.cls_end && item.stf_invalid===0"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="班级备注:">
							<el-input type="textarea" v-model="edit.model.cls_remark"
							          placeholder="请输入班级备注..." :rows="3"></el-input>
						</el-form-item>
					</div>
					<el-form-item label="教室分配: " prop="cls_clsr_id" v-else>
						<el-select v-model="edit.model.cls_clsr_id" placeholder="-请选择-">
							<el-option
								v-for="item in classrooms"
								:key="item.clsr_id"
								:label="item.clsr_name"
								:value="item.clsr_id"
							>
							</el-option>
						</el-select>
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
				@size-change="getClass()"
				@current-change="getClass(false)"
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

        let {mapGetters: mapGettersFD} = createNamespacedHelpers("dictionary")
        let {mapState: mapStateFS} = createNamespacedHelpers("classroom");
        export default {
                name: "Class",
                data(){
                        return {
                                classList: [],
                                pagination: {
                                        pageSize: 5,
                                        currentPage: 1,
                                        total: 0,
                                },
                                search: {
                                        cls_dic_id_major: 0,
                                        cls_name: "",
                                        cls_status: 0,
                                },
                                edit: {
                                        isEdit: false,
                                        mode: 0,
                                        state: false,
                                        model: {
                                                cls_id: 0,
                                                cls_name: "",
                                                cls_dic_id_major: null,
                                                cls_clsr_id: null,
                                                cls_status: -1,
                                                cls_stf_id_teacher: null,
                                                cls_stf_id_admin: null,
                                                cls_stf_id_job: null,
                                                cls_begin: null,
                                                cls_end: null,
                                                cls_remark: "",
                                        }
                                },
                                rules: {
                                        cls_name: [
                                                {required: true, message: '*员工名字不能为空', trigger: 'blur'},
                                                {min: 2, max: 20, message: '*员工名字长度在2 到 20个字符', trigger: 'blur'},
                                                {
                                                        validator: async(rule, value, callback) =>{
                                                                if(await this.$http({
                                                                                url: "/class/valid_name/",
                                                                                method: "post",
                                                                                data: {
                                                                                        cls_name: value
                                                                                }
                                                                        })) callback(new Error("班级已存在"))
                                                                else callback();
                                                        },
                                                        trigger: "blur"
                                                }
                                        ],
                                        cls_dic_id_major: [
                                                {required: true, message: '*请选择专业', trigger: 'change'},
                                        ],
                                        cls_stf_id_teacher: [
                                                {required: true, message: '*请选择职务', trigger: 'change'},
                                        ],
                                        cls_stf_id_admin: [
                                                {required: true, message: '*请选择职务', trigger: 'change'},
                                        ],
                                        cls_stf_id_job: [
                                                {required: true, message: '*请选择职务', trigger: 'change'},
                                        ],
                                        cls_clsr_id: [
                                                {required: true, message: '*请选班级', trigger: 'change'},
                                        ]
                                },
//                                EnumStaffCategory: {
//                                        teacher: 4,
//                                        admin: 5,
//                                        job: 6
//                                },
//                                staff_teacher: [],
//                                staff_admin: [],
//                                staff_job: [],
                        }
                },
                computed: {
                        ...mapGettersFD(["getGroupByKey"]),
                        ...mapStateFS(["classrooms"]),
                },
                methods: {
                        async getClass(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        url: "/class/list",
                                        method: "post",
                                        data: {
                                                ...this.search,
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: this.pagination.pageSize
                                        }
                                });
                                this.classList = list;
                                this.pagination.total = total;
                        },
                        beginAdd(){
                                this.edit.mode = 0;
                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                this.edit.model.cls_id = null;
                                this.edit.model.cls_name = "";
                                this.edit.model.cls_dic_id_major = null;
                                this.edit.model.cls_clsr_id = null;
                                this.edit.model.cls_stf_id_teacher = null;
                                this.edit.model.cls_stf_id_admin = null;
                                this.edit.model.cls_stf_id_job = null;
                                this.edit.model.cls_begin = null;
                                this.edit.model.cls_end = null;
                                this.edit.model.cls_remark = "";
                                this.edit.isEdit = true;
                        },
                        beginUpdate(classMessage){
                                this.edit.mode = 1;
                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                this.edit.model.cls_id = classMessage.cls_id;
                                this.edit.model.cls_name = classMessage.cls_name;
                                this.edit.model.cls_dic_id_major = classMessage.cls_dic_id_major;
                                this.edit.model.cls_clsr_id = classMessage.cls_clsr_id;
                                this.edit.model.cls_stf_id_teacher = classMessage.cls_stf_id_teacher;
                                this.edit.model.cls_stf_id_admin = classMessage.cls_stf_id_admin;
                                this.edit.model.cls_stf_id_job = classMessage.cls_stf_id_job;
                                this.edit.model.cls_begin = classMessage.cls_begin;
                                this.edit.model.cls_end = classMessage.cls_end;
                                this.edit.model.cls_remark = classMessage.cls_remark;
                                this.edit.isEdit = true;

                        },
                        beginCls(obj){
                                this.$confirm(`确定要对班级"${obj.cls_name}"进开班操作吗?`, "警告", {type: "warning"})
                                        .then(async() =>{
                                                this.edit.mode = 2;
                                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                                this.edit.model.cls_id = obj.cls_id;
                                                this.edit.model.cls_clsr_id = null;
                                                this.edit.isEdit = true;
                                        }).catch(() =>{
                                })
                        },
                        endCls(obj){
                                this.$confirm(`确定要对班级"${obj.cls_name}"进行结课操作吗?`, "警告", {type: "warning"})
                                        .then(async() =>{
                                                let begin = await this.$http({
                                                        url: "/class/end",
                                                        method: 'post',
                                                        data: {
                                                                cls_id: obj.cls_id
                                                        }
                                                })
	                                        let  i=this.classList.findIndex(item=> item.cls_id===obj.cls_id)
                                                let c = this.classrooms.findIndex(item => item.clsr_id === obj.cls_clsr_id);
                                                this.classList[i].cls_end=begin;
                                                this.classrooms[c].clsr_occupy = 0;
                                                this.$message({
                                                        message: "结课成功!",
                                                        type: "success"
                                                })
                                        }).catch(() =>{
                                })
                        },
                        formValidateHandler(prop, valid, message){
                                if(prop === "cls_name") this.classNameValidateResult = valid;
                        },
                        async save(){
//                                this.$refs.form.validate(async valid =>{
//                                        if(!valid) return;
                                if(this.edit.mode === 2){
                                        await new Promise(resolve => this.$refs.form.validateField("cls_clsr_id", message =>{
                                                if(message === "") resolve();
                                        }))
                                        let begin = await this.$http({
                                                url: "/class/begin",
                                                method: 'post',
                                                data: {
                                                        cls_id: this.edit.model.cls_id,
                                                        cls_clsr_id: this.edit.model.cls_clsr_id
                                                }

                                        })
                                        let  i=this.classList.findIndex(item=> item.cls_id===this.edit.model.cls_id);
                                        let c = this.classrooms.findIndex(item => item.clsr_id === this.edit.model.cls_clsr_id);
	                                this.classList[i].cls_begin=begin;
                                        this.classList[i].cls_clsr_id=this.edit.model.cls_clsr_id;
                                        this.classrooms[c].clsr_occupy = 1;

                                        this.$message({
                                                message: "开课成功!",
                                                type: "success"
                                        })
                                }
                                else{
                                        if(this.edit.mode === 0){
                                                if(this.classNameValidateResult === false) return;
                                                if(typeof this.classNameValidateResult === "undefined"){
                                                        await new Promise(resolve => this.$refs.form.validateField("cls_name", message =>{
                                                                if(message === "") resolve();
                                                        }));
                                                }
                                        }
                                        await new Promise(resolve => this.$refs.form.validateField("cls_dic_id_major", message =>{
                                                if(message === "") resolve();
                                        }))
                                        await new Promise(resolve => this.$refs.form.validateField("cls_stf_id_teacher", message =>{
                                                if(message === "") resolve();
                                        }))
                                        await new Promise(resolve => this.$refs.form.validateField("cls_stf_id_admin", message =>{
                                                if(message === "") resolve();
                                        }))
                                        await new Promise(resolve => this.$refs.form.validateField("cls_stf_id_job", message =>{
                                                if(message === "") resolve();
                                        }))

                                        if(this.edit.mode === 0){
                                                this.edit.model.cls_id = await this.$http({
                                                        url: "/class/add",
                                                        method: 'post',
                                                        data: {
                                                                ...this.edit.model
                                                        }
                                                })
                                                this.classList.push(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `"${this.edit.model.cls_name}" 班级添加成功!`,
                                                        type: "success"
                                                });
                                        }
                                        else if(this.edit.mode === 1){
                                                await this.$http({
                                                        url: "/class/update",
                                                        method: 'post',
                                                        data: this.edit.model
                                                })
                                                let i = this.classList.findIndex(item => item.cls_id === this.edit.model.cls_id)
                                                this.classList.splice(i, 1, Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `"${this.edit.model.cls_name}" 修改成功!`,
                                                        type: "success"
                                                });
                                        }
                                }
                                this.edit.isEdit = false;
                        }
                },
                async created(){
                    let classList= await this.$http({
                                url: "/class/list",
                                method: "post",
                                data: {
                                        ...this.search,
                                        begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                        pageSize: this.pagination.pageSize
                                }
                        });
                    this.classList=classList.list;
                    this.pagination.total = classList.total;
//                        Promise.all([p1, p2, p3, p4])
//                                .then(([staffTeacher, staffAdmin, staffJob, classList]) =>{
//                                        this.staff_teacher = staffTeacher;
//                                        this.staff_admin = staffAdmin;
//                                        this.staff_job = staffJob;
//                                        this.classList = classList.list;
//                                        this.pagination.total = classList.total;
//                                })
//                                .catch(error => console.log(error))
                },
                watch: {
                        'edit.isEdit'(newValue){
                                if(newValue === false) delete this.classNameValidateResult;
                        }
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