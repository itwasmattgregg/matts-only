import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getPostListItems } from "~/models/post.server";

type LoaderData = {
  postListItems: Awaited<ReturnType<typeof getPostListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const postListItems = await getPostListItems();
  return json<LoaderData>({ postListItems });
};

export default function NotesPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Feed</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="w-full bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Post
          </Link>

          <hr />

          {data.postListItems.length === 0 ? (
            <p className="p-4">No posts yet</p>
          ) : (
            <ol>
              {data.postListItems.map((post) => (
                <li key={post.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={post.id}
                  >
                    {post.body}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
