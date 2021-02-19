<template>
	<el-container>
		<el-header>
			<el-form :inline="true" class="form_box">
				<el-row type="flex" justify="space-between" :gutter="20">
					<el-col :span="15.5">
						<el-form-item label="学生姓名:">
							<el-input v-model="search.stu_name" clearable
							          prefixIcon="el-icon-search"
							          placeholder="请输入搜索内容"
							          @change="getStudent()"></el-input>
						</el-form-item>
						<el-form-item label="所在班级:">
							<el-select v-model="search.stu_cls_id" @change="getStudent()">
								<el-option label="-所有班级-" :value="0"></el-option>
								<el-option label="-无班级-" :value="null"></el-option>
								<el-option
									v-for="item in classList"
									:key="item.cls_id"
									:label="item.cls_name"
									:value="item.cls_id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="学生学历:">
							<el-select v-model="search.stu_qualification"
							           @change="getStudent()">
								<el-option label="-全部-" :value="0"></el-option>
								<el-option
									v-for="item in  getGroupByKey('qualification')"
									:key="item.dic_id"
									:label="item.dic_name"
									:value="item.dic_id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6.5">
						<el-button type="primary" class="el-icon-plus" @click="beginAdd">新增
						</el-button>
						<el-button type="success" class="el-icon-share"
						           @click="divideIntoClasses()">批量分班
						</el-button>
						<el-button type="danger" class="el-icon-download">导出学生信息</el-button>
					</el-col>
				</el-row>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="studentList" stripe border @selection-change="handleSelectionChange">
				<el-table-column type="index" fixed="left" align="center"></el-table-column>
				<el-table-column type="selection" fixed="left" align="center"></el-table-column>
				<el-table-column prop="stu_name" label="学生姓名" fixed="left"
				                 align="center"></el-table-column>
				<el-table-column label="班级" align="center">
					<template slot-scope="{row}">
						<span v-if="!row.stu_cls_id" style="color: #ccc;">无班级</span>
						<span v-else
						      v-text="classList.length>0 ? classList.find(item=> item.cls_id===row.stu_cls_id).cls_name :''"></span>
					</template>
				</el-table-column>
				<el-table-column label="存档照片" align="center">
					<template slot-scope="{row}">
						<el-popover
							placement="right"
							:title="row.stu_name"
							width="200"
							trigger="click"
						>
							<img v-if="!row.stu_avatar" src="/images/student/init.jpg"
							     class="image"/>
							<img v-else :src="row.stu_avatar" class="image">
							<el-link type="primary" slot="reference" :underline="false">预览
							</el-link>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="性别" align="center">
					<template slot-scope="{row}">
						<span v-text="row.stu_sex===1 ? '男' : '女' "></span>
					</template>
				</el-table-column>
				<el-table-column prop="stu_phone" label="联系电话" align="center"
				                 width="120"></el-table-column>
				<el-table-column prop="stu_phone2" label="联系电话(备用)" align="center"
				                 width="120"></el-table-column>
				<el-table-column prop="stu_born" label="出生日期" align="center"
				                 width="120"></el-table-column>
				<el-table-column label="学历" align="center" width="120">
					<template slot-scope="{row}">
						<span v-text="getGroupByKey('qualification').find(item=>item.dic_id===row.stu_qualification).dic_name"></span>
					</template>
				</el-table-column>
				<el-table-column prop="stu_school" label="毕业院校" align="center"
				                 width="140"></el-table-column>
				<el-table-column prop="stu_major" label="院校专业" align="center"
				                 width="140"></el-table-column>
				<el-table-column prop="stu_address" label="家庭住址" align="center"
				                 width="140"></el-table-column>
				<el-table-column prop="stu_remark" label="备注" align="center"
				                 width="140"></el-table-column>
				<el-table-column label="操作" fixed="right" width="400" align="center">
					<template slot-scope="{row}">
						<el-button size="small" type="success" icon="el-icon-share"
						           @click="divideIntoClasses(row.stu_id,row.stu_cls_id)">分班
						</el-button>
						<el-button size="small" type="danger" icon="el-icon-picture"
						           @click="operationImg(row.stu_id,row.stu_avatar)">照片存档
						</el-button>
						<el-button size="small" type="primary" icon="el-icon-edit"
						           @click="beginUpdate(row)">编辑
						</el-button>
						<el-button size="small" type="warning" icon="el-icon-delete">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog :modal="false" :visible.sync="edit.isEdit" :show-close="false"
			           :close-on-click-modal="false" width="600px">
				<template slot="title" class="header-title">
					<h3 v-text="edit.mode===0 ? '学生维护-新增' :  '学生维护-修改'" v-show="edit.mode<2"></h3>
					<h3 v-show="edit.mode===2">分班</h3>
				</template>
				<el-form :model="edit.model" ref="form" :rules="rules" status-icon label-position
				         label-width="110px">
					<div v-show="edit.mode<2">
						<el-form-item label="学生姓名:" prop="stu_name">
							<el-input placeholder="请输入学生姓名"
							          v-model="edit.model.stu_name"></el-input>
						</el-form-item>
						<el-form-item label="性别:">
							<el-radio-group v-model="edit.model.stu_sex">
								<el-radio :label="1">男</el-radio>
								<el-radio :label="0">女</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="联系电话:" prop="stu_phone">
							<el-input placeholder="请输入手机号"
							          v-model="edit.model.stu_phone"
							          oninput="value=value.replace(/[^\d]/g,'')"
							          maxlength="11"
							          show-word-limit
							></el-input>
						</el-form-item>
						<el-form-item label="备用电话:" prop="stu_phone2">
							<el-input placeholder="请输入备用联系电话(手机号/坐机号)"
							          v-model="edit.model.stu_phone2">
								<template slot="append">例如：028-88888888</template>
							</el-input>
						</el-form-item>
						<el-form-item label="出生日期:" prop="stu_born">
							<div class="block">
								<el-date-picker
									v-model="edit.model.stu_born"
									type="date"
									placeholder="选择日期"
									:editable="false"
									value-format="yyyy-MM-dd">
								</el-date-picker>
							</div>
						</el-form-item>
						<el-form-item label="学生学历:" prop="stu_qualification">
							<el-select v-model="edit.model.stu_qualification"
							           placeholder="-请选择学生学历-">
								<el-option
									v-for="item in getGroupByKey('qualification')"
									:key="item.dic_id"
									:label="item.dic_name"
									:value="item.dic_id"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="在读/毕业院校:">
							<el-input placeholder="请输入在读/毕业院校(选填)"
							          v-model="edit.model.stu_school"></el-input>
						</el-form-item>
						<el-form-item label="在校学习专业:">
							<el-input placeholder="请输入在校学习专业(选填)"
							          v-model="edit.model.stu_major"></el-input>
						</el-form-item>
						<el-form-item label="家庭住址:" prop="stu_address">
							<el-input placeholder="请输入家庭住址"
							          v-model="edit.model.stu_address"></el-input>
						</el-form-item>
						<el-form-item label="学生备注:">
							<el-input type="textarea" placeholder="请输入学生备注..." :rows="3"
							          v-model="edit.model.stu_remark"></el-input>
						</el-form-item>
					</div>
					<el-form-item label="班级:" v-show="edit.mode===2" prop="stu_cls_id">
						<el-select v-model="assignclass.stu_cls_id">
							<el-option label="-无班级-" :value="null"></el-option>
							<el-option
								v-for="item in classList"
								:key="item.cls_id"
								:label="item.cls_name"
								:value="item.cls_id"
								:disabled="item.cls_end!==null"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="edit.isEdit = false">取 消</el-button>
					<el-button type="primary" @click="save">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog :modal="false" :visible.sync="upload.isUpload"
			           :show-close="false" :close-on-click-modal="false"
			           width="500px">
				<template slot="title" class="header-title">
					<h3>照片存档</h3>
				</template>
				<div class="avatar_old">
					<p style="text-align: center;margin:0  0 10px 0;font-size: 20px;font-weight: bolder;">
						当前图片</p>
					<el-image
						:src="upload.model.stu_avatar_old ? upload.model.stu_avatar_old : '/images/student/init.jpg' "
						fit="fill"></el-image>
				</div>
				<div class="avatar_new">
					<div style="flex-grow: 1;padding: 0">
						<el-row type="flex" justify="center">
							<el-upload
								class="avatar-uploader"
								name="avatar"
								ref="upload"
								accept=".jpg,.png"
								list-type="picture-card"
								action="/student/avatarupload"
								:before-upload="beforeAvatarUpload"
								:headers="uploadHeaders"
								:on-success="avatarUploadSuccess"
								:on-remove="avatarRemove"
							>
								<i class="el-icon-plus"></i>
							</el-upload>
						</el-row>
						<p style="text-align: center;font-size: 16px">替换图片</p>
						<p style="text-align: center;color: red">提示:只能上传jpg或png文件,大小不能超过2MB！</p>
					</div>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="avatarCancel">取 消</el-button>
					<el-button type="primary" :disabled="upload.model.stu_avatar_new===''"
					           @click="saveImg">存档
					</el-button>
				</div>
			</el-dialog>
		</el-main>
		<el-footer>
			<el-pagination
				background
				@size-change="getStudents()"
				@current-change="getStudents(false)"
				:total="pagination.total"
				:page-sizes=[5,8,10]
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
                name: "Student",
                data(){
                        return {
                                classList: [],
                                studentList: [],
                                search: {
                                        stu_name: "",
                                        stu_cls_id: 0,
                                        stu_qualification: 0,
                                },
                                pagination: {
                                        pageSize: 5,
                                        currentPage: 1,
                                        total: 0,
                                },
                                edit: {
                                        isEdit: false,
                                        mode: 0,
                                        model: {
                                                stu_id: null,
                                                stu_name: null,
                                                stu_avatar: null,
                                                stu_cls_id: null,
                                                stu_sex: 1,
                                                stu_phone: null,
                                                stu_phone2: null,
                                                stu_born: null,
                                                stu_qualification: null,
                                                stu_school: "",
                                                stu_major: "",
                                                stu_address: null,
                                                stu_remark: ""
                                        }
                                },
                                assignclass: {stu_id: null, stu_ids: [], stu_cls_id: null},
                                uploadHeaders: {"Authorization": sessionStorage.getItem("token")},
                                upload: {
                                        isUpload: false,
                                        model: {
                                                stu_id: 0,
                                                stu_avatar_old: null,
                                                stu_avatar_new: ""
                                        }
                                },
                                rules: {
                                        stu_name: [
                                                {required: true, message: "*学生名字必填！", trigger: "blur"},
                                                {min: 2, max: 20, message: '*学生名字长度2 - 20', trigger: 'blur'},
                                        ],
                                        stu_phone: [
                                                {required: true, message: "*学生的联系电话必填！", trigger: 'blur'},
                                                {
                                                        validator: async(rule, value, callback) =>{
                                                                if(!/^1[3|4|5|7|8][0-9]{9}$/.test(value))
                                                                        callback(new Error('*无效的手机号！'))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur"
                                                }
                                        ],
                                        stu_phone2: [
                                                {required: true, message: "*备用电话必填！", trigger: 'blur'},
                                                {
                                                        validator: async(rule, value, callback) =>{
                                                                if(/^1[3|4|5|7|8][0-9]{9}$/.test(value) || /^[0][1-9]{2,3}-[0-9]{5,10}$/.test(value))
                                                                        callback();
                                                                else
                                                                        callback(new Error('*无效的手机号/座机号！'))
                                                        },
                                                        trigger: "blur"
                                                }
                                        ],
                                        stu_born: [
                                                {required: true, message: "出生日期必填！", trigger: 'blur'}
                                        ],
                                        stu_qualification: [
                                                {required: true, message: "学生的学历必选！", trigger: 'change'}
                                        ],
                                        stu_address: [
                                                {required: true, message: "学生家庭住址必填！", trigger: 'blur'}
                                        ]
                                }
                        }
                },
                computed: {
                        ...mapGetters(["getGroupByKey"]),
                },
                methods: {
                        async getStudent(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        url: "/student/list",
                                        method: "post",
                                        data: {
                                                ...this.search,
                                                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                pageSize: this.pagination.pageSize
                                        }
                                })
                                this.studentList = list
                                this.pagination.total = total;
                        },
                        initForm(obj){
                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                if(!obj){
                                        this.edit.model.stu_id = null;
                                        this.edit.model.stu_name = null;
                                        this.edit.model.stu_sex = 1;
                                        this.edit.model.stu_avatar = null;
                                        this.edit.model.stu_cls_id = null;
                                        this.edit.model.stu_phone = null;
                                        this.edit.model.stu_phone2 = null;
                                        this.edit.model.stu_born = null;
                                        this.edit.model.stu_qualification = null;
                                        this.edit.model.stu_school = "";
                                        this.edit.model.stu_major = "";
                                        this.edit.model.stu_address = null;
                                        this.edit.model.stu_remark = "";
                                }else{
                                        this.edit.model.stu_id = obj.stu_id;
                                        this.edit.model.stu_name = obj.stu_name;
                                        this.edit.model.stu_sex = obj.stu_sex;
                                        this.edit.model.stu_avatar = obj.stu_avatar;
                                        this.edit.model.stu_cls_id = obj.stu_cls_id;
                                        this.edit.model.stu_phone = obj.stu_phone;
                                        this.edit.model.stu_phone2 = obj.stu_phone2;
                                        this.edit.model.stu_born = obj.stu_born;
                                        this.edit.model.stu_qualification = obj.stu_qualification;
                                        this.edit.model.stu_school = obj.stu_school;
                                        this.edit.model.stu_major = obj.stu_major;
                                        this.edit.model.stu_address = obj.stu_address;
                                        this.edit.model.stu_remark = obj.stu_remark;
                                }
                        },
                        beginAdd(){
                                this.edit.mode = 0;
                                this.initForm();
                                this.edit.isEdit = true;
                        },
                        beginUpdate(obj){
                                this.edit.mode = 1;
                                this.initForm(obj)
                                this.edit.isEdit = true;
                        },
	                //批量分班
                        divideIntoClasses(stu_id, stu_cls_id){
                                if(this.assignclass.stu_ids.length === 0 && stu_id === undefined){
                                        this.$alert("请勾选要分班的学生！", "警告", {type: "warning"})
                                        return
                                }
                                this.edit.mode = 2;
                                this.$refs.form && this.$refs.form.resetFields();//重置表单
                                if(stu_id !== undefined){
                                        this.assignclass.stu_id = stu_id;
                                        this.assignclass.stu_cls_id = stu_cls_id;
                                }else{
                                        this.assignclass.stu_id = null;
                                        this.assignclass.stu_cls_id = null;
                                }
                                this.edit.isEdit = true;
                        },
	                //分班
                        handleSelectionChange(val){
                                this.assignclass.stu_ids = [];
                                val.forEach(item =>
                                        this.assignclass.stu_ids.push(item.stu_id)
                                )
                                console.log(this.assignclass.stu_ids)
                        },
                        async save(){
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;
                                        if(this.edit.mode === 0){
                                                this.edit.model.stu_id = await this.$http({
                                                        url: "/student/add",
                                                        method: "post",
                                                        data: this.edit.model
                                                });
                                                this.studentList.push(Object.assign({}, this.edit.model))
                                                this.$message.success("添加成功!");
                                        }
                                        else if(this.edit.mode === 1){
                                                await this.$http({
                                                        url: "/student/update",
                                                        method: "post",
                                                        data: this.edit.model
                                                });
                                                let i = this.studentList.findIndex(item => item.stu_id === this.edit.model.stu_id)
                                                this.studentList.splice(i, 1, Object.assign({}, this.edit.model))
                                                this.$message.success("修改成功！");
                                        }
                                        else{
                                                await this.$http({
                                                        url: "/student/assignclass",
                                                        method: "post",
                                                        data: this.assignclass
                                                });
                                                if(this.assignclass.stu_id) this.studentList.find(item => item.stu_id === this.assignclass.stu_id).stu_cls_id = this.assignclass.stu_cls_id;
                                                else{
                                                        this.assignclass.stu_ids.forEach(item =>{
                                                                this.studentList.find(item1 => item1.stu_id === item).stu_cls_id = this.assignclass.stu_cls_id
                                                        })
                                                }
                                                this.$message.success("分班成功！");
                                        }
                                        this.edit.isEdit = false;
                                })
                        },
                        operationImg(id, avatar){
                                this.upload.model.stu_id = id;
                                avatar === ""?this.upload.model.stu_avatar_old = null:this.upload.model.stu_avatar_old = avatar;
                                this.upload.model.stu_avatar_new = "";
                                this.upload.isUpload = true;
                        },
                        beforeAvatarUpload(file){
                                const isJPG = file.type === "image/jpeg";
                                const isPNG = file.type === "image/png";
                                const isLt2M = file.size / 1024 / 1024 < 2
                                if((!isJPG) && (!isPNG)){
                                        this.$message.error("上传头像图片只能是JPG或PNG格式");
                                }
                                if(!isLt2M){
                                        this.$message.error("上传头像图片大小不能超过2MB");
                                }
                                return (isJPG || isPNG) && isLt2M;
                        },
                        avatarUploadSuccess({status, data, message}, file, fileList){
                                switch(status){
                                        case 200:
                                                this.upload.model.stu_avatar_new = data;
                                                if(fileList.length > 1) fileList.shift();
                                                break;
                                        case 401:
                                        case 404:
                                        case 199:
                                        case 500:
                                                this.$message.error(message)
                                }
                        },
                        avatarRemove(file, fileList){
                                this.upload.model.stu_avatar_new = "";
                        },
                        async saveImg(){
                                let imageAddress = await this.$http({
                                        method: "post",
                                        url: "/student/avatarupdate",
                                        data: this.upload.model
                                });
                                this.studentList.find(item => item.stu_id === this.upload.model.stu_id).stu_avatar = imageAddress
                                this.$message.success("头像上传更新成功！");
                                this.upload.isUpload = false;
                                this.$refs.upload.clearFiles();
                        },
                        avatarCancel(){
                                this.upload.isUpload = false;
                                this.$refs.upload.clearFiles();
                        }

                },
                async created(){
                        this.getStudent();
                        this.classList = await this.$http({
                                url: "/class/all"
                        })
                }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>
	.image
		width: 100%

	.el-container
		position: absolute
		left: 0
		top: 0
		height: 100%
		width: 100%
		overflow: hidden
		.el-col
			flex-shrink: 0
		h3
			background-color: deepskyblue
			color: white
			padding: 10px
		/deep/ .el-dialog__body
			padding: 0 20px
			.avatar_old
				margin: 0 0 10px 0px
				width: 100%
				text-align: center
				.el-image
					width: 150px
					height: 180px
					border: 1px solid #d9d9d9
					box-sizing: border-box
					border-radius: 6px
					vertical-align: middle
			.avatar_new
				display: flex
				flex-shrink: 0
				align-items: center
				.el-row
					padding: 5px 0
					box-sizing: border-box
				.avatar-uploader
					/deep/ .el-upload-list__item
						width: 116px
						height: 140px
						margin: 0 10px 0 0
					/deep/ .el-upload
						border: 1px dashed #d9d9d9
						border-radius: 6px
						width: 116px
						height: 140px
						line-height: 140px
						margin: 0 10px 0 0
						&:hover
							border-color: #409EFF

</style>