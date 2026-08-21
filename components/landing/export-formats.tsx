"use client";

import { motion } from "framer-motion";
import { Braces, Code2, FileJson, FileSpreadsheet, FileText } from "lucide-react";

const formats = [
  { icon: FileJson, label: "JSON", desc: "Structured objects" },
  { icon: FileText, label: "CSV", desc: "Rows & columns" },
  { icon: FileSpreadsheet, label: "Excel", desc: ".xlsx workbooks" },
  { icon: Code2, label: "HTML", desc: "Rendered tables" },
  { icon: Braces, label: "XML", desc: "Nested nodes" },
];

export function ExportFormats() {
  return (
    <section id="pricing" className="relative py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Export Your Data In{" "}
            <span className="bg-linear-to-r from-primary to-sky-400 bg-clip-text text-transparent">
              Any Format
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Download clean, ready-to-use data wherever your workflow lives.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {formats.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="glass-card glass-card-hover rounded-2xl p-6 w-36 sm:w-40 flex flex-col items-center gap-3 depth-shadow cursor-pointer group"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
                <Icon className="w-6 h-6" />
              </span>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
