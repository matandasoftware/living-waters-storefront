export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[#dbe7c5] bg-[#184d2d] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:grid-cols-3">
        <div>
          <h4 className="text-lg font-bold">Living Waters</h4>
          <p className="mt-2 text-sm text-white/90">
            Fresh produce delivery with wellness-focused products for families.
          </p>
        </div>

        <div>
          <h5 className="font-semibold">Contact</h5>
          <p className="mt-2 text-sm">WhatsApp: 0649354540</p>
          <p className="text-sm">Email: stellarmazibuko@gmail.com</p>
        </div>

        <div>
          <h5 className="font-semibold">Quick Links</h5>
          <p className="mt-2 text-sm">Shop Online</p>
          <p className="text-sm">Farm Subscription Box</p>
          <p className="text-sm">Wellness Tips</p>
        </div>
      </div>
    </footer>
  );
}