<template>
	<view class="">
		<view v-if="cardsList.length>0" class="cards-tem">
			<template v-for="item in cardsList">
				<CardDetail :type='item.type' :key="item.id" :title="item.title" :time="item.time" :tags="item.tags||[]"
					:descripts="item.descripts||[]" />
			</template>
		</view>
		<u-empty v-else style='background-color: #ececec;' text="这个作者很聪明,还没有写任何项目~"
			icon="http://cdn.uviewui.com/uview/empty/car.png">
		</u-empty>
	</view>
</template>

<script>
	/* 组件 */
	import CardDetail from '@/components/cardDetail.vue'

	export default {
		name: 'cardsIndex',
		props: {
			cardsList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {};
		},
		created() {

		},
		methods: {},
		components: { CardDetail }
	}
</script>

<style lang="scss" scoped>

</style>
