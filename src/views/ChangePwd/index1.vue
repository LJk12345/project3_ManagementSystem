<template>
	<div>
		<demo :a.sync="aa" v-model="bb">
			密码修改
			<p>默认插入1</p>
			<span>默认插入2</span>
			<!--<p slot="a1" slot-scope="scope">-->
			<!--这是内容1-->
			<!--<span  v-text="scope.age"></span>-->
			<!--<span  v-text="scope.ts"></span>-->
			<!--</p>-->
			<p slot="a1" slot-scope="{name,age,ts}">
				<span v-text="age"></span>
				<span v-text="ts"></span>
			</p>
			<span slot="a2">这是内容2</span>
		</demo>
	</div>
</template>

<script type="text/ecmascript-6">
        import demo from '../../components/demo.vue'

        export default {
                name: "Demo",
                components: {demo},
                data(){
                        return {
                                aa: 10,
                                bb: 10
                        }
                }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>

</style>