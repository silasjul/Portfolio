import { motion, Transition } from 'framer-motion';
import Image from 'next/image';
import GetInTouchCTA from './ui/GetInTouchCTA';

const transition: Transition = { duration: 1.3, ease: 'anticipate', delay: .3 }

export default function Navbar() {
    return (
        <motion.div
            className="sticky top-8 my-8 mx-8 grid grid-cols-3 items-center text-[1.4rem] z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
        >
            {/* Logo */}
            <motion.div
                className="flex items-center cursor-pointer gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={transition}
            >
                <Image
                    className="rounded-md w-15"
                    src={'/logo.png'}
                    alt={'logo'}
                    width={735}
                    height={485}
                />
                {/* <p className="opacity-85">Studio</p> */}
            </motion.div>

            {/* Navigation Links */}
            <motion.div
                className="flex gap-12 mx-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
            >
                <a
                    href="#works"
                    className="tracking-wide transition-colors duration-200 relative group"
                >
                    <span className="flex gap-0.5">
                        <span className="text-sm">(1)</span>
                        Works
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                    href="#services"
                    className="tracking-wide transition-colors duration-200 relative group"
                >
                    <span className="flex gap-0.5">
                        <span className="text-sm">(2)</span>
                        Services
                    </span>

                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                    href="#about"
                    className="tracking-wide transition-colors duration-200 relative group"
                >
                    <span className="flex gap-0.5">
                        <span className="text-sm">(3)</span>
                        About
                    </span>

                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
            </motion.div>
            {/* Crazy hover CTA */}
            <motion.div
                className="ml-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={transition}
            >
                <GetInTouchCTA arrow={true}>Get In Touch</GetInTouchCTA>
            </motion.div>
        </motion.div>
    );
}
