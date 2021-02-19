import http from "../utils/http.js";

export default {
        namespaced: true,
        state: {
                classrooms: [],
                isInit: false,
        },
        mutations: {
                _init(state, classrooms){
                        state.classrooms = classrooms;
                        state.isInit=true
                },
                _add(state, model){
                        state.classrooms.push(Object.assign({},model))
                },
                _update(state, model){
                        let i = state.classrooms.findIndex(item => item.clsr_id === model.clsr_id);
                        state.classrooms.splice(i, 1, Object.assign({},model));
                },
                _remove(state,clsr_id){
                        let i = state.classrooms.findIndex(item => item.clsr_id === clsr_id);
                        state.classrooms.splice(i, 1);
                }
        },
        actions: {
                async init({state,commit,rootState}){
                        if(state.isInit) return;
                        let  classrooms=await rootState.http({url: "/classroom/all"})
                        commit("_init", classrooms)
                },
                async  add({commit,rootState},model){
                        model.clsr_id = await rootState.http({
                                method: "post",
                                url: "/classroom/add",
                                data: model
                        });
                        console.log(model)
                        commit("_add",model)
                },
                async update({commit,rootState},model){
                        await rootState.http({
                                method: "post",
                                url: "/role/update",
                                data: model
                        });
                        commit("_update",model)
                },
                async remove({commit,rootState}, clsr_id){
                        await rootState.http({
                                url: '/classroom/remove/'+ clsr_id,
                        });
                        commit("_remove",clsr_id)
                },
        },
}