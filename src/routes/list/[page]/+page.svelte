<script lang="ts">
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import Pagination from '$lib/components/Pagination.svelte';
    
    export let data: PageData;
    
    let pageSize = 6;

    $: images = data.images;
    $: totalImages = data.totalImages;
    $: totalPages = Math.ceil(totalImages / pageSize);
    $: currentPage = Number($page.params.page) - 1;


</script>

<!-- TailwindCSS Grid container to display images -->
<div class="container flex flex-col">
    <div class="grid grid-cols-3 gap-8">
        {#each images as image}
        <!-- <div><img src={`/api/thumb/`}{image.id} alt="{image.name}"/></div> -->
        <div class="card w-84 bg-base-100 shadow-xl">
            <figure><img src={`/api/image/`}{image.id} alt="{image.name}" /></figure>
            <div class="card-body">
              <p>{image.name}</p>
              <div class="card-actions justify-end">
                <form action="?/deleteImage&id={image.id}" method="POST">
                    <button class="btn btn-primary">Delete Now</button>
                </form>
              </div>
            </div>
          </div>
        {/each}
    </div>
    
    <!-- Pagination component -->
    <Pagination {totalPages} {currentPage} />
  
</div>


