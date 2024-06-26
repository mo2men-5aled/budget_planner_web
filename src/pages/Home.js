import { useState, useEffect, useCallback } from "react";
import {
  Text,
  Box,
  Button,
  Flex,
  Spacer,
  FormControl,
  Input,
  Select,
  useToast,
  HStack,
  Card,
  Center,
} from "@chakra-ui/react";

import ProgressbarComponent from "../components/Progressbar";
import http from "../connection/connect";

import CustomModal from "../modals/customModal";
import LimitList from "../components/LimitList";
import Loader from "../components/Loader";

const Home = ({ triggerAction, setTriggerAction, labels }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const toast = useToast();
  //form states
  const [label, setLabel] = useState("");
  const [limit, setLimit] = useState("");

  const [user, setUser] = useState(null);

  //modal state
  const [isOpen, setIsOpen] = useState(false);

  // modal handlers
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setError("");

    setIsOpen(false);
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));

        const response = await http.get("/app/user-data", {
          headers: { Authorization: `Bearer ${userData?.token}` },
        });
        setUser(response.data.data);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errorLog
        ) {
          toast({
            title: "Error",
            description: error.response.data.errorLog,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    };

    getUserData();
  }, [setTriggerAction, toast]);

  const handleAddingLimit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      const formValues = {
        label,
        limit,
      };

      try {
        const response = await http.post("/app/limits", formValues, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userData"))?.token
            }`,
          },
        });

        if (response.status === 200) {
          setLoading(false);
          toast({
            title: "Success",
            description: response.data.msg,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setTriggerAction(true);
          closeModal();
        }
      } catch (error) {
        if (error.response) {
          setLoading(false);
          setError(error.response.data.errorLog);
        } else {
          setLoading(false);
          setError("Something went wrong. Please try again later.");
        }
      }
    },
    [label, limit, setTriggerAction, toast]
  );

  if (!user) {
    return <Loader />;
  }
  const { spent, remaining, total } = user;

  const progressPercentage = (spent / total) * 100;
  const animationDurationInMs = 1500;
  return (
    <>
      <CustomModal
        isOpen={isOpen}
        triggerAction={triggerAction}
        setTriggerAction={setTriggerAction}
        modalHeader="Add Limit"
      >
        <form onSubmit={handleAddingLimit}>
          <Select
            placeholder="Select Label"
            onChange={(e) => {
              setLabel(e.target.value);
            }}
          >
            {labels?.map((label) => (
              <option key={label._id} value={label.label}>
                {label.label}
              </option>
            ))}
          </Select>
          <FormControl mt={4}>
            <Input
              placeholder="Limit Value"
              onChange={(e) => {
                setLimit(e.target.value);
              }}
            />
          </FormControl>

          {error && (
            <Box color="red.500" mt={3} textAlign="center">
              {typeof error === "string" ? (
                <p>{error}</p>
              ) : error.length > 0 ? (
                error.map((error) => {
                  return <p key={error}>{error}</p>;
                })
              ) : (
                <p>{error}</p>
              )}
            </Box>
          )}

          <HStack
            mt={5}
            justifyContent="end"
            alignItems="center"
            w="100%"
            p={3}
          >
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Adding Limit"
              colorScheme="teal"
            >
              Add Limit
            </Button>
            <Button
              me={3}
              onClick={closeModal}
              isDisabled={isLoading ? true : false}
              colorScheme="teal"
            >
              Cancel
            </Button>
          </HStack>
        </form>
      </CustomModal>

      <Box>
        <Center>
          <Box
            mt={5}
            mb={3}
            p={5}
            boxShadow=" 0px 6px 8px -10px rgba(0,0,0,0.5)"
          >
            <ProgressbarComponent
              percentage={progressPercentage}
              duration={animationDurationInMs}
              progressColor="teal.500"
              progressBarSize="30rem"
              fontWeight="bold"
              fontSize="6xl"
              // TrailColor="#dddddd"
              details={
                <Box
                  textAlign="center"
                  fontSize="md"
                  fontWeight="6xl"
                  // color="#666"
                >
                  <Text fontWeight="bold">{spent} Spent </Text>
                  <Text fontWeight="bold">{remaining} Remaining </Text>
                  <Text fontWeight="bold">{total} Total Budget</Text>
                </Box>
              }
            />
          </Box>
        </Center>

        <Flex p={4} justifyContent="center" alignItems="center">
          <Text as="span" fontSize="lg" fontWeight="bold">
            Monthly Limits
          </Text>

          <Spacer />
          <Box>
            <Button
              size="sm"
              colorScheme={"teal"}
              onClick={() => {
                openModal();
              }}
            >
              Add Monthly Limit
            </Button>
          </Box>
        </Flex>
        <Card
          bg={"rgb(0,0,0,0.09)"}
          minH={"10rem"}
          boxShadow=" 0px 6px 8px -10px rgba(0,0,0,0.5)"
          borderRadius="md"
          justifyContent={"center"}
          alignItems={"center"}
        >
          <LimitList
            triggerAction={triggerAction}
            setTriggerAction={setTriggerAction}
          />
        </Card>
      </Box>
    </>
  );
};

export default Home;
