<template>
	<view class="Fabu__">
		<!-- 文本域 -->
		<u--textarea confirmType='done' v-model="text" placeholder="请输入内容"></u--textarea>
		<br />
		<!-- 上传组件 -->
		<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="10">
		</u-upload>
	</view>
</template>

<script>
	/* api */
	import { uploadFileApi, deleteFileApi, updateImgId, uploadCirApi } from '@/api/circle.js';

	export default {
		name: 'CirFabuIndex',
		data() {
			return {
				text: '',
				fileList: [],
				imgId: 0, // 图片id,每次发布使用统一id
			}
		},
		onLoad() {
			this.updateImgId()
		},
		methods: {
			// 更新id
			async updateImgId() {
				try {
					const { id } = await updateImgId()
					this.imgId = id
				} catch (e) {
					//TODO handle the exception
				}
			},
			// 删除图片
			async deletePic(event) {
				try {
					const nowImgPath = event['file']['url'].replace(this.$baseURL, '')
					const { data } = await deleteFileApi(nowImgPath)
					this.fileList.splice(event.index, 1)
				} catch (e) {
					//TODO handle the exception
				}
			},
			// 新增图片
			async afterRead(event) {
				try {
					if (!this.imgId) return this.$u.toast('页面失效,重新进入')
					const file = event.file[0]
					this.fileList.push({
						url: file.url,
						status: 'uploading',
						message: '上传中...'
					})
					const { url } = await uploadFileApi(file.url)
					if (!url) throw new Error()
					this.fileList.splice(this.fileList.length - 1, 1, {
						url: this.$baseURL + url,
						status: 'success',
						message: '',
					})
				} catch (e) {
					//TODO handle the exception
				}
			},
			// 发布事件
			async theFaBu() {
				try {
					if (!this.text.trim()) return this.$u.toast('文案内容是空的~')
					const text = this.text || ''
					const urls = this.fileList.map(v => v.url.replace(this.$baseURL, ''))
					const { data } = await uploadCirApi({
						text,
						urls
					})

					uni.switchTab({
						url: '/pages/circle/circle',
						success: () => {
							setTimeout(() => {
								uni.showToast({
									title: data,
									duration: 500,
									icon: 'none',
									position: 'top'
								})
							}, 0)
						}
					})
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		onNavigationBarButtonTap({ index }) {
			if (index === 0) {
				this.theFaBu()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.Fabu__ {
		padding: 20rpx;
	}
</style>
