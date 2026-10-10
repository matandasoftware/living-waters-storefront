export default function InfoBlocks() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl border border-[#dbe7c5] bg-[#f9fcf4] p-5">
        <h3 className="text-lg font-semibold text-[#556B2F]">Wellness Tips</h3>
        <p className="mt-2 text-sm text-gray-700">
          Learn nutritional benefits of foods, herbs, and healthy habits for daily wellness.
        </p>
      </section>

      <section className="rounded-xl border border-[#dbe7c5] bg-[#f9fcf4] p-5">
        <h3 className="text-lg font-semibold text-[#556B2F]">
          Personalized Nutrition Guidance
        </h3>
        <p className="mt-2 text-sm text-gray-700">
          Need personal help? Book an appointment for tailored nutrition support.
        </p>
        <button className="mt-4 rounded-md bg-[#556B2F] px-4 py-2 text-sm font-medium text-white hover:bg-[#465a26]">
          Book Appointment
        </button>
      </section>
    </div>
  );
}