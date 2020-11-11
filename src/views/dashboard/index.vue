<template>
    <div class="page-container">
        <p class="title">组件再封装</p>
        <el-form label-position="left" :model="form" label-width="80px">
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                    <template slot="title">
                        <p class="sub-title">1.上传图片</p>
                    </template>
                    <p class="third-title">
                        静态上传（选择文件后进行处理并返回文件本身供父组件使用）
                    </p>

                    <static-upload
                        :imgList="form.staticImgs"
                        :sizeLimit="5"
                        :length="5"
                        @getFile="getStaticImgs"
                    ></static-upload>

                    <p class="third-title">
                        动态上传（选择文件后进行处理并自动上传返回url等参数供父组件使用）
                    </p>

                    <dynamic-upload
                        :fileList="form.dynamicImgs"
                        :limitNum="5"
                        :maxSize="5"
                        @getFilelist="getDynamicImg"
                    ></dynamic-upload>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        <p class="sub-title">2.上传文件</p>
                    </template>

                    <el-form-item label="上传pdf">
                        <upload-file
                            @getFile="getPdf"
                            acceptType="pdf"
                        ></upload-file>
                    </el-form-item>

                    <el-form-item label="上传txt">
                        <upload-file
                            @getFile="getTxt"
                            acceptType="txt"
                        ></upload-file>
                    </el-form-item>

                    <el-form-item label="上传excel">
                        <upload-file
                            @getFile="getExcel"
                            acceptType="excel"
                        ></upload-file>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
        </el-form>
    </div>
</template>

<script>
import dynamicUpload from "@/components/tools/uploadImg/dynamicUpload";
import staticUpload from "@/components/tools/uploadImg/staticUpload";
import uploadFile from "@/components/tools/uploadFile";

export default {
    data() {
        return {
            activeNames: ["1", "2"],

            form: {
                staticImgs: [],
                dynamicImgs: [],
                pdf: null,
                txt: null,
                excel: null,
            },
        };
    },
    components: {
        staticUpload,
        dynamicUpload,
        uploadFile,
    },
    methods: {
        getStaticImgs(list) {
            this.form.staticImgs = list;
        },
        getDynamicImg(list) {
            this.form.dynamicImgs = list;
        },
        getPdf(file) {
            this.form.pdf = file;
        },
        getTxt(file) {
            this.form.txt = file;
        },
        getExcel(file) {
            this.form.excel = file;
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