<template>
	<view class="createProject__">
		<!-- 功能区 -->
		<view class="fnct" style="display: flex;justify-content: flex-start;">
			<u-button @click="modalShow=true" icon='plus' type="success" style='margin: 5rpx;' size="mini"
				text="添加新的技术"></u-button>
		</view>
		<!-- 表单区 -->
		<u--form labelWidth='80' :model="form" ref="uForm" :rules='uFormRules'>
			<u-form-item label="项目名称:" prop="title">
				<u-input v-model="form.title" />
			</u-form-item>
			<u-form-item label="项目类型:" prop="type">
				<u-input v-model="form.type" />
			</u-form-item>
			<u-form-item label="项目时间:" prop="time" borderBottom>
				<uni-datetime-picker v-model="form.time" type="datetimerange" rangeSeparator="至" />
				<u-icon slot="right" name="arrow-right"></u-icon>
			</u-form-item>
			<u-form-item label="所用技术:">
				<u-checkbox-group style='flex-wrap: wrap;width: 100%;' v-model="checkLables" @change="checkboxChange"
					placement="row">
					<template v-for="(item,index) in technics">
						<u-checkbox :key="index" :customStyle="{marginRight:'10rpx'}" activeColor="green" :label="item"
							:name="item">
						</u-checkbox>
					</template>
				</u-checkbox-group>
			</u-form-item>
		</u--form>
		<!-- 功能描述 -->
		<view class="functionDeScript">
			<view class="des-header">
				<view class="left">项目的一些功能描述</view>
				<view @click="deScriptShow=true" class="right">添加一条描述</view>
			</view>
			<view class="content">
				<view class="title">现有的描述:</view>
				<view class="bd" style="padding-left:20rpx;">
					<template v-for="(item,index) in form.descripts">
						<view :key="index" class="deScipt-item">
							<u--text bold :text="item.title"></u--text>
							<u--text :text="item.text"></u--text>
							<u-line style='margin:10rpx 0'></u-line>
						</view>
					</template>
				</view>
			</view>
		</view>
		<u-modal @cancel="deScriptShow=false" @confirm='addNewDescript' :show="deScriptShow" title="添加一条描述"
			showCancelButton>
			<view class="slot-content">
				<u--form :model="desmodalForm" ref="desmodalUForm" :rules='desmodalFormRules'>
					<u-form-item label="标题" prop="title">
						<u--input placeholder="请输入标题~" border="surround" v-model="desmodalForm.title"></u--input>
					</u-form-item>
					<u-form-item label="详细内容" prop="text">
						<u--textarea confirmType='done' v-model="desmodalForm.text" placeholder="请输入内容~">
						</u--textarea>
					</u-form-item>
				</u--form>
			</view>
		</u-modal>
		<!-- 模态框 -->
		<u-modal @cancel="modalShow=false" @confirm='addNewTechnics' :show="modalShow" title="新增技术选项" showCancelButton>
			<view class="slot-content">
				<u--form :model="modalForm" ref="modalUForm" :rules='modalRules'>
					<u-form-item prop="newTechnics">
						<u--input placeholder="请输入内容" border="surround" v-model="modalForm.newTechnics"></u--input>
					</u-form-item>
				</u--form>
			</view>
		</u-modal>
	</view>
</template>

<script>
	/* tool */
	import { isNull } from '@/utils/tool.js';

	export default {
		name: 'createProject',
		data() {
			return {
				showCalendar: false, // 时间弹出框
				modalShow: false, // 模态框显示
				checkLables: [], // 技术点复选框最终的值
				modalForm: { newTechnics: '' }, // 新增的技术选项
				modalRules: {
					newTechnics: [{
						required: true,
						message: '请输入内容~',
						trigger: 'blur',
					}, ]
				},
				form: {
					title: '',
					time: '',
					type: '',
					tags: [],
					descripts: []
				},
				uFormRules: {
					title: [{
						required: true,
						message: '请输入项目名称~',
						trigger: 'blur',
					}, ],
					time: [{
						required: true,
						message: '请选择项目时间~',
						trigger: 'blur',
					}, ],
					type: [{
						required: true,
						message: '请输入项目类型~',
						trigger: 'blur',
					}, ],
				},
				// 描述变量
				deScriptShow: false,
				desmodalForm: { text: '', title: '' },
				desmodalFormRules: {
					text: [{
						required: true,
						message: '请输入描述内容~',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '请输入标题~',
						trigger: 'blur'
					}]
				}
			};
		},
		computed: {
			technics() {
				return this.$store.state.project.currentTechnics
			}
		},
		onNavigationBarButtonTap({ index }) {
			if (index === 0) {
				this.publishProjectInfo();
			}
		},
		methods: {
			// 正式发布
			publishProjectInfo() {
				try {
					/**
					 * 发布前进行校验
					 * 名称,类型,时间不能为空
					 * **/
					if (isNull(this.form.title) || isNull(this.form.time) || isNull(this.form.type)) return this.$u.toast(
						'请将信息填写完整~');
					const app = this;
					// 通过可以提交!
					uni.showModal({
						title: '提示',
						content: '再次确认是否提交?',
						async success(res) {
							if (res.confirm) {
								await app.$store.dispatch('project/addProjectInfoItem', app.form);
								uni.switchTab({
									url: '/pages/projects/projects',
									success() {
										setTimeout(() => {
											uni.showToast({
												title: '添加成功~',
												duration: 700,
												position: 'top',
												icon: 'none'
											});
										}, 100)
									}
								});
							}
						}
					})
				} catch (e) {
					//TODO handle the exception
				}
			},
			// 添加一条新的描述
			addNewDescript() {
				this.$refs.desmodalUForm.validate().then(() => {
					this.form.descripts.push({
						title: this.desmodalForm.title,
						text: this.desmodalForm.text,
					})
					this.$u.toast('添加了一条描述~')
					Object.assign(this.desmodalForm, {
						title: '',
						text: ''
					})
					this.deScriptShow = false;
				}).catch(e => {
				})
			},
			// 添加新技术
			addNewTechnics() {
				this.$refs.modalUForm.validate().then(() => {
					this.$store.commit('project/addCurrentTechnics', this.modalForm.newTechnics);
					this.modalForm.newTechnics = '';
					this.$u.toast('新增成功~');
					this.modalShow = false;
				}).catch(e => {})
			},
			// 技术点复选框变化事件
			checkboxChange(e) {
				this.form.tags = e
			},
		}
	}
</script>

<style lang="scss" scoped>
	.createProject__ {
		padding: 20px;
		box-sizing: border-box;

		.functionDeScript {
			.content {
				.title {
					color: $u-info;
				}
			}

			.des-header {
				display: flex;
				justify-content: space-between;

				.left {
					color: $u-info;
				}

				.right {
					color: $u-success;
				}
			}
		}
	}
</style>
