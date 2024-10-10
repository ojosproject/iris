import { useRouter } from "next/router";

const MedDetail = () => {
  const router = useRouter();
  const { medication_name, given_dose, last_taken } = router.query;

  return (
    <div>
      <h1>Medication Details</h1>
      <p>
        <strong>Name:</strong> {medication_name}
      </p>
      <p>
        <strong>Given Dose:</strong> {given_dose}
      </p>
      <p>
        <strong>Last Taken:</strong> {last_taken}
      </p>
    </div>
  );
};

export default MedDetail;
