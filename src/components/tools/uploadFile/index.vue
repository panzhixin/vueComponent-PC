<template>
    <div class="form-upload-box">
        <div class="form-upload">
            <el-input placeholder="点击上传附件" v-model="fileName"></el-input>
            <input
                type="file"
                class="upload-file"
                @change="handleFileChange"
                ref="selectfile"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "uploadFile",
    props: {
        acceptType: {
            type: String,
            default: "all",
        },
    },
    data() {
        return {
            fileObj: {},
            fileName: "",
        };
    },
    methods: {
        //检测文件是否符合格式
        ifMatchFormat(file) {
            try {
                switch (this.acceptType) {
                    case "pdf":
                        if (!/\.(pdf)$/.test(file.name)) {
                            this.$message({
                                type: "warning",
                                message: "请上传pdf文件",
                            });
                            throw new Error("stop");
                        }

                        break;

                    case "excel":
                        if (!/\.(xlsx)$/.test(file.name)) {
                            this.$message({
                                type: "warning",
                                message: "请上传xlsx格式的excel文件",
                            });
                            throw new Error("stop");
                        }

                        break;

                    case "txt":
                        if (!/\.(txt)$/.test(file.name)) {
                            this.$message({
                                type: "warning",
                                message: "请上传txt文件",
                            });
                            throw new Error("stop");
                        }
                        break;
                }
            } catch (e) {
                return e.message != "stop";
            }
            return true;
        },
        //当文件改变时把文件提交到父组件去
        handleFileChange(e) {
            let inputDOM = this.$refs.selectfile;
            this.fileObj = inputDOM.files[0];

            if (!this.ifMatchFormat(this.fileObj)) {
                return false;
            }
            this.fileName = this.fileObj.name;
            this.$emit("getFile", this.fileObj);
        },
        //清除文件
        clearFile() {
            this.fileName = "";
        },
    },
    mounted() {},
};
</script>

<style lang="less" scoped>
.form-upload {
    position: relative;
    .upload-file {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 40px;
        opacity: 0;
        cursor: pointer;
    }
    .el-upload {
        width: 100%;
    }
}
</style>
