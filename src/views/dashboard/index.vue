<template>
    <div class="page-container">
        <p class="title">组件再封装</p>

        <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
                <template slot="title">
                    <p class="sub-title">1.上传图片</p>
                </template>
                <p class="third-title">
                    静态上传（选择文件后进行处理并返回文件本身供父组件使用）
                </p>

                <static-upload
                    :imgList="staticImgs"
                    :sizeLimit="5"
                    :length="5"
                    @getFile="getStaticImgs"
                ></static-upload>

                <p class="third-title">
                    动态上传（选择文件后进行处理并自动上传返回url等参数供父组件使用）
                </p>

                <dynamic-upload
                    :fileList="dynamicImgs"
                    :limitNum="5"
                    :maxSize="5"
                    @getFilelist="getDynamicImg"
                ></dynamic-upload>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import dynamicUpload from "@/components/tools/uploadImg/dynamicUpload";
import staticUpload from "@/components/tools/uploadImg/staticUpload";

export default {
    data() {
        return {
            activeNames: ["1"],
            staticImgs: [],
            dynamicImgs: [],
        };
    },
    components: { staticUpload, dynamicUpload },
    methods: {
        getStaticImgs(list) {
            this.staticImgs = list;
            console.log(this.staticImgs);
        },
        getDynamicImg(list) {
            this.dynamicImgs = list;
            console.log(this.dynamicImgs);
        },
    },
};
</script>

<style lang="less" scope>
.page-container {
    padding: 30px;

    .title {
        padding-bottom: 20px;
        font-size: 30px;
        text-align: center;
    }

    .sub-title {
        font-size: 18px;
    }

    .third-title {
        font-size: 16px;
        margin: 10px 0;
    }

    .item {
        margin-bottom: 20px;
        line-height: 30px;
    }
}
</style>