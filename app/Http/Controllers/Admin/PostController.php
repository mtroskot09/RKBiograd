<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Support\ImageStore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class PostController extends Controller
{
    public function index(): View
    {
        return view('admin.posts.index', ['posts' => Post::latest('published_at')->get()]);
    }

    public function create(): View
    {
        return view('admin.posts.form', ['post' => new Post(['category' => 'Novosti', 'published_at' => now()])]);
    }

    public function store(Request $request): RedirectResponse
    {
        $post = new Post($this->validated($request));
        if ($request->hasFile('image')) {
            $post->image_src = ImageStore::store($request->file('image'));
        }
        $post->save();

        return redirect()->route('admin.posts.index')->with('status', 'Vijest je objavljena');
    }

    public function edit(Post $post): View
    {
        return view('admin.posts.form', ['post' => $post]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $post->fill($this->validated($request));
        $previousImage = $post->getOriginal('image_src');
        if ($request->hasFile('image')) {
            $post->image_src = ImageStore::store($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $post->image_src = null;
        }
        $post->save();
        ImageStore::replaced($previousImage, $post->image_src);

        return redirect()->route('admin.posts.index')->with('status', 'Promjene su spremljene');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();
        ImageStore::delete($post->image_src);

        return redirect()->route('admin.posts.index')->with('status', 'Vijest je obrisana');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['required', 'string', 'max:50000'],
            'category' => ['required', Rule::in(Post::CATEGORIES)],
            'published_at' => ['required', 'date'],
            'image' => ['nullable', ...ImageStore::RULES],
        ]);
    }
}
