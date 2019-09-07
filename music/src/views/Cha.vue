<template>
    <div>
        <ul>
            <li v-for="(item,index) in list" :key="index">
                <slot :sc="item.sc"> 
                   
                </slot>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return{
            list:[
                {
                    sc:"dada1"
                },
                {
                    sc:"dada2"
                },
                {
                    sc:"dada3"
                }
            ]
        }
    }
}
</script>