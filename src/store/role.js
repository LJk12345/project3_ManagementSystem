import http from "../utils/http.js";

export default {
        namespaced: true,
        state: {
                roles: [],
                isInit: false,
        },
        mutations: {
                _init(state, roles){
                        state.roles = roles;
                        state.isInit=true
                },
                _add(state, model){
                        state.roles.push(model)
                },
                _update(state, model){
                        let i = state.roles.findIndex(item => item.role_id === model.role_id);
                        state.roles.splice(i, 1, model);
                },
                _removeRole(state, role_id){
                        let i = state.roles.findIndex(item => item.role_id === role_id);
                        state.roles.splice(i, 1);
                }
        },
        actions: {
                async init(context){
                        if(context.state.isInit) return;
                        let roles=await http({url: "/role/all"})
                        context.commit("_init",roles)
                },
                async  add(context,model){
                        model.role_id = await http({
                                method: "post",
                                url: "/role/add",
                                data: model
                        });
                        context.commit("_add",model)
                },
                async update(context,model){
                        await http({
                                method: "post",
                                url: "/role/update",
                                data: model
                        });
                        context.commit("_update",model)
                },
                async removeRole(context, role_id){
                        await http({
                                url: '/role/remove/' + role_id,
                                method: "post"
                        });
                        context.commit("_removeRole",role_id)
                },

        },

}