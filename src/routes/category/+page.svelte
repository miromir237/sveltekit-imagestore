<script lang="ts">
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

    export let data: PageData

    $: ({ categories } = data);

    const { form, errors, enhance, constraints } = superForm(data.form, {
        taintedMessage: "Are you sure you want to leave this page?",
        validators: {
            name: (name) => {
                if (name.length < 3) {
                    return "Name must be at least 3 characters long"
                }
                if (name.length > 16) {
                    return "Name must be at most 16 characters long"
                }
            }
        }
    })
</script>

<div class="grid grid-cols-2 gap-4">
    <div class="bg-gray-100 p-4">
        <h2 class="text-2xl font-bold">Categories</h2>
        <ul class="list-disc pl-5 pt-2">
            {#each categories as category}
                <li>
                    {category.name}
                </li>
            {/each}
        </ul>
    </div>
    
    <div class="bg-gray-100 p-4">
        <h2 class="text-2xl font-bold">Create new category</h2>
        <form action="?/createCategory" method="post" use:enhance>
            <label for="name">Name</label>
            <input type="text" name="name" id="name" class="input input-bordered w-full max-w-xs" bind:value={$form.name} />
            {#if $errors.name}
                <div class="text-red-500">{$errors.name}</div>
            {/if}
            <div class="pt-2 justify-end flex"><button type="submit" class="btn btn-primary">Create</button></div>
        </form>
    </div>
    <!-- Debug 
    <div class="bg-gray-100 p-4 col-span-2">
        <h2 class="text-2xl font-bold">Debug</h2>
        <SuperDebug data={$form}/>
    </div>
    -->
</div>
