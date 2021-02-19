export  default {
        namespaced: true,
        state: {
                dictionary: [],
                isInit:false
        },
        getters:{
                getGroupByKey(state){
                        return function(groupKey){
                                return state.dictionary.filter(item=>item.dic_group_key===groupKey)
                        };
                }
        },
        mutations:{
                _init(state,list){
                        state.isInit=true;
                       state.dictionary=list
                }
        },
        actions:{
                async init({state,commit,rootState}){
                        if(state.isInit) return;
                      let list = await rootState.http({
                               url: "/dictionary/all"
                       })
                        commit("_init",list);
                }
        }
}