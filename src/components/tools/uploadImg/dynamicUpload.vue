<template>
    <div class="dynamic-upload">
        <el-upload
            action=""
            list-type="picture-card"
            :file-list="fileList"
            :limit="limitNum"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
        >
            <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible" width="35%">
            <template slot="title">
                <p class="img-title">图片预览</p>
            </template>
            <img width="100%" :src="dialogImageUrl" alt="" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import uploadApi from "@/api/upload/index.js";

export default {
    props: {
        fileList: Array,
        limitNum: Number,
        maxSize: Number,
    },
    data() {
        return {
            dialogImageUrl: "",
            dialogVisible: false,
        };
    },
    methods: {
        //处理删除
        handleRemove(file, fileList) {
            let index = this.fileList.findIndex((item) => {
                return item.name == file.name;
            });
            this.fileList.splice(index, 1);
            this.$emit("getFilelist", this.fileList);
        },
        //预览图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //超过最大上传数时
        handleExceed(files, fileList) {
            this.$message({
                type: "warning",
                message: "请勿超过最大上传数：" + this.limitNum + "张图片",
            });
            return false;
        },
        //上传前进行容量与格式等限制
        beforeUpload(file) {
            if (file.size > this.maxSize * 1024 * 1024) {
                this.$message({
                    type: "warning",
                    message: "请勿上传大于：" + this.maxSize + "MB的图片",
                });
                return false;
            }

            if (file.type.indexOf("image") == -1) {
                this.$message({
                    type: "warning",
                    message: "请上传JPG、JPEG、PNG或者BMP等格式的图片",
                });
                return false;
            }
        },
        //处理上传
        async handleUpload(file) {
            file = file.file;
            const img = await this.readImg(file);
            const blob = await this.compressImg(
                img,
                file.type,
                1000,
                1000,
                file
            );
            let formdata = new FormData();
            formdata.append("img", blob, file.name);
            uploadApi.uploadImg(formdata).then((res) => {
                if (res.success) {
                    this.fileList.push(res.data);
                    this.$emit("getFilelist", this.fileList);
                }
            });
        },
        // 压缩前将file转换成img对象
        readImg(file) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const reader = new FileReader();
                reader.onload = function (e) {
                    img.src = e.target.result;
                };
                reader.onerror = function (e) {
                    reject(e);
                };
                reader.readAsDataURL(file);
                img.onload = function () {
                    resolve(img);
                };
                img.onerror = function (e) {
                    reject(e);
                };
            });
        },
        //压缩图片
        compressImg(img, type, mx, mh, file) {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                const { width: originWidth, height: originHeight } = img;
                // 最大尺寸限制
                const maxWidth = mx;
                const maxHeight = mh;
                // 目标尺寸
                let targetWidth = originWidth;
                let targetHeight = originHeight;
                if (originWidth > maxWidth || originHeight > maxHeight) {
                    if (originWidth / originHeight > 1) {
                        // 宽图片
                        targetWidth = maxWidth;
                        targetHeight = Math.round(
                            maxWidth * (originHeight / originWidth)
                        );
                    } else {
                        // 高图片
                        targetHeight = maxHeight;
                        targetWidth = Math.round(
                            maxHeight * (originWidth / originHeight)
                        );
                    }
                }
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                context.clearRect(0, 0, targetWidth, targetHeight);
                // 图片绘制
                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                canvas.toBlob(function (blob) {
                    resolve(blob);
                }, type || "image/png");
            });
        },
    },
};
</script>

<style lang="less" scope>
.dynamic-upload {
    img {
        object-fit: cover;
    }
    .img-title {
        font-size: 16px;
        text-align: center;
    }
}
</style>