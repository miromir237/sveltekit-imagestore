<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    $: ({ categories } = data);

    let uploadedImage: string | null = null;

    function uploadImage(event: Event) {
        event.preventDefault();
        const image = (event.target as HTMLInputElement).files?.[0];
        if (!image) return;
        uploadedImage = URL.createObjectURL(image);
    }

</script>

<div class="container">
    <div class="flex flex-row flex-1 justify-center">
    
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="filename" accept="image/*" on:change={uploadImage} />
            <div class="p-2">
                <label for="catId">Category</label>
                <select class="select w-full max-w-xs" name="catId">
                    <option disabled selected>Pick image category</option>
                    {#each categories as category}
                    <option value="{category.id}">{category.name}</option>
                    {/each}
                </select>
            </div>
            <div class="flex justify-center"><button class="btn" type="submit" disabled={!uploadedImage ?? null}>Upload</button></div>
        </form>
    </div>
    <div class="flex flex-row flex-1 justify-center p-4">
        {#if uploadedImage}
            <img src="{uploadedImage}" alt="uploadedImage"/>
        {/if}
    </div>


</div>