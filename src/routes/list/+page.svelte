<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;

    $: ({ images } = data);
</script>

<!-- TailwindCSS Grid container to display images -->
<div class="container">
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
</div>