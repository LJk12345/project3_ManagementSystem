export  default {
        namespaced: true,
        state: {
                EnumStaffCategory: {
                        teacher: 4,
                        admin: 5,
                        job: 6
                },
                staffTeacher:[],
                staffAdmin:[],
                staffJob:[],
                isInit:false
        },
        mutations:{
                _init(state,obj){
                        state.isInit=true;
                        state.staffTeacher=obj.staffTeacher
                        state.staffAdmin=obj.staffAdmin
                        state.staffJob=obj.staffJob
                },
                updateTeacher(state,teacher){
                        switch(teacher.stf_category){
                                case 4:
                                        state.staffTeacher.find(item =>item.stf_id===teacher.stf_id).stf_invalid=teacher.stf_id
                                        break;
                                case 5:
                                        state.staffAdmin.find(item =>item.stf_id===teacher.stf_id).stf_invalid=teacher.stf_id
                                        break;
                                case 6:
                                        state.staffJob.find(item =>item.stf_id===teacher.stf_id).stf_invalid=teacher.stf_id
                                        break;
                                default :
                                        break;
                        }
                },
        },
        actions:{
                async init({state,commit,rootState}){
                       let p1=rootState.http({url: "/staff/listbycategory/" + state.EnumStaffCategory.teacher});
                       let p2=rootState.http({url: "/staff/listbycategory/" + state.EnumStaffCategory.admin});
                       let p3=rootState.http({url: "/staff/listbycategory/" + state.EnumStaffCategory.job});

                        Promise.all([p1, p2, p3])
                               .then(([staffTeacher, staffAdmin, staffJob]) =>{
                                       commit("_init",{staffTeacher,staffAdmin,staffJob})
                               })
                               .catch(error => console.log(error))

                }
        }
}