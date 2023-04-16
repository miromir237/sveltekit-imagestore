<script lang="ts">
    export let totalPages: number;
    export let currentPage: number;
</script>

<div class="btn-group pt-4">
    {#each Array(totalPages) as _, i}
      <a href="/list/{i + 1}" class={currentPage === i ? 'btn btn-primary' : 'btn'}>{i + 1}</a>
    {/each}
</div>





<!-- Path: src/lib/components/Pagination.svelte -->
