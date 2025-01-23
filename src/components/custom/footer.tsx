import { Link } from "react-router-dom"
import { Facebook, Instagram, Linkedin, TwitterX } from "react-bootstrap-icons"

export default function Footer() {
  return (
    <section className="w-full py-6 md:py-12">
      <div className="px-4 md:px-6 flex flex-col items-center text-center w-full">
        <h1 className="font-bold text-xl">TMDB2</h1>
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none">
          Stay Connected
        </h2>
        <p className="mx-auto">
          Subscribe to our newsletter and follow us on our social media.
        </p>
        <div className="w-full max-w-md space-y-2 my-4">
        </div>
        <div className="flex justify-center space-x-6">
          <Link to="#" aria-label="Facebook page" className="hover:text-blue-600">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link to="#" aria-label="Twitter profile" className="hover:text-gray-600">
            <TwitterX className="h-6 w-6" />
          </Link>
          <Link to="#" aria-label="Instagram profile" className="hover:text-pink-600">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link to="#" aria-label="LinkedIn profile" className="hover:text-sky-600">
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  )
}
